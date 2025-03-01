from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import fitz  # PyMuPDF for reading PDFs
from deep_translator import GoogleTranslator
import io
import uvicorn
from typing import Optional, Dict, List
import os
import time
from functools import lru_cache
import logging
import asyncio
from contextlib import asynccontextmanager
import hashlib  # For robust cache key generation
import json  # For serializing complex arguments

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Global model cache
MODEL_CACHE = {}

# Custom exception for model loading failures
class ModelLoadingError(Exception):
    pass

# Lifespan context manager for model loading at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models at startup
    logger.info("Loading models...")
    try:
        load_models()
        logger.info("Models loaded successfully")
    except ModelLoadingError as e:
        logger.critical(f"Failed to load models: {e}")
        # Consider shutting down the app gracefully or alerting an admin here
        # raise  # Uncomment to stop app startup if models fail
        pass # Continue even if models fail, but log clearly
    yield
    # Cleanup on shutdown
    logger.info("Clearing model cache...")
    MODEL_CACHE.clear()

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Legal Aid Chatbot API",
    description="A comprehensive API for legal assistance, document processing, and multilingual support for Indian legal contexts",
    version="1.1.0",
    lifespan=lifespan
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins (VERY IMPORTANT FOR SECURITY)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model loading function
def load_models():
    # Use a smaller, more efficient general-purpose model for faster inference
    try:
        # Attempt to load a smaller model with comparable quality
        MODEL_CACHE["text_generator"] = pipeline(
            "text-generation",
            model="distilgpt2",  # Smaller, faster model
            max_length=512
        )
        logger.info("Loaded distilgpt2 for text generation")
    except Exception as e:
        logger.error(f"Error loading text generation model: {str(e)}")
        # Emergency fallback to an even smaller model
        try:
            MODEL_CACHE["text_generator"] = pipeline(
                "text-generation",
                model="sshleifer/tiny-gpt2",
                max_length=512
            )
            logger.info("Loaded tiny-gpt2 for text generation (fallback)")
        except Exception as e:
            logger.error(f"Error loading fallback text generation model: {str(e)}")
            MODEL_CACHE["text_generator"] = None
            raise ModelLoadingError("Failed to load text generation models")  # Raise exception for fatal error

    # Load a smaller QA model
    try:
        MODEL_CACHE["qa_model"] = pipeline(
            "question-answering",
            model="distilbert-base-cased-distilled-squad"  # Smaller, faster QA model
        )
        logger.info("Loaded distilbert for QA")
    except Exception as e:
        logger.error(f"Error loading QA model: {str(e)}")
        MODEL_CACHE["qa_model"] = None

    # Load a smaller summarization model
    try:
        MODEL_CACHE["summarizer"] = pipeline(
            "summarization",
            model="sshleifer/distilbart-cnn-6-6",  # Smaller summarization model
            max_length=250,
            min_length=50
        )
        logger.info("Loaded distilbart for summarization")
    except Exception as e:
        logger.error(f"Error loading summarization model: {str(e)}")
        MODEL_CACHE["summarizer"] = None

# Response cache decorator
def response_cache():
    cache = {}

    def decorator(func):
        async def wrapper(data):  # Adjusted for different endpoint models
            if isinstance(data, Query):  # Handle Query model
                key = data.question
            elif isinstance(data, NoticeData): # Handle NoticeData
                key = f"{data.recipient_name}-{data.subject}"
            elif isinstance(data, RoadmapRequest): # Handle RoadmapRequest
                 key = f"{data.issue_type}-{data.jurisdiction}"
            elif isinstance(data, TranslationRequest):  #Handle TranslationRequest
                key = f"{data.text}-{data.dest_lang}"
            else:
                key = str(hashlib.md5(json.dumps(data, sort_keys=True, default=lambda o: o.__dict__).encode('utf-8')).hexdigest()) # General case, using a hash
                logger.warning("Using general key creation for caching.  Consider a model specific key")

            if key in cache:
                logger.info(f"Cache hit for {func.__name__} with key: {key}")
                return cache[key]

            # Generate new response
            response = await func(data)

            # Store in cache (limit cache size)
            if len(cache) > 100:
                oldest_key = next(iter(cache))
                del cache[oldest_key]

            cache[key] = response
            logger.info(f"Cached response for {func.__name__} with key: {key}")
            return response

        return wrapper

    return decorator

# Cached text generation - Consider adding generation parameters
@lru_cache(maxsize=50)
def generate_text(prompt, max_length=300, temperature=0.7, top_p=0.9): #Added temp and top_p for control
    """Cached text generation function to avoid repeated identical generations"""
    start_time = time.time()

    # Get text generator from cache
    text_generator = MODEL_CACHE.get("text_generator")

    if text_generator is None:
        # Fallback text if model failed to load
        return [{
            "generated_text": f"\n\nI apologize, but I'm currently unable to access my language generation capabilities. "
                             f"Please try again later or contact support if this issue persists."
        }]

    # Generate text with error handling
    try:
        response = text_generator(prompt, max_length=max_length, num_return_sequences=1) #, temperature=temperature, top_p=top_p) # Add temperature and top_p in model's generate function
        logger.info(f"Text generation took {time.time() - start_time:.2f} seconds")
        return response
    except Exception as e:
        logger.error(f"Error in text generation: {str(e)}")
        return [{
            "generated_text": f"{prompt}\n\nI apologize, but I encountered an error while generating a response. "
                             f"Please try again with a simpler request."
        }]

# === Data Models ===

# Query Model for Legal Chatbot
class Query(BaseModel):
    question: str

# Legal Notice Data Model
class NoticeData(BaseModel):
    recipient_name: str
    recipient_address: str
    subject: str
    case_details: str
    your_name: str
    jurisdiction: Optional[str] = "India"
    notice_type: Optional[str] = "Legal Notice"

# Document Analysis Request
class DocumentAnalysisRequest(BaseModel):
    query: Optional[str] = "Summarize this document"

# Legal Roadmap Request
class RoadmapRequest(BaseModel):
    issue_type: str
    jurisdiction: Optional[str] = "India"
    timeline: Optional[str] = "Standard"

# Translation Request
class TranslationRequest(BaseModel):
    text: str
    dest_lang: str = "en"

# Response Models for better documentation
class ChatResponse(BaseModel):
    response: str

class NoticeResponse(BaseModel):
    notice: str

class RoadmapResponse(BaseModel):
    steps: List[str]
    jurisdiction: str
    issue_type: str

class TranslationResponse(BaseModel):
    translated_text: str
    source_text: str
    target_language: str

class DocumentAnalysisResponse(BaseModel):
    answer: Optional[str] = None
    confidence: Optional[float] = None
    summary: Optional[str] = None
    document_length: int
    document_text: Optional[str] = None
    message: Optional[str] = None

# === API Endpoints ===

# Health check endpoint
@app.get("/health", status_code=200)
def health_check():
    """Health check endpoint to verify API is operational"""
    return {"status": "healthy", "models_loaded": {k: (v is not None) for k, v in MODEL_CACHE.items()}}

# Chat Endpoint with improved performance and error handling
@app.post("/chat/", response_model=ChatResponse)
@response_cache()
async def chat(data: Query):  # Now accepts 'data' which is a Query object
    try:
        # Expert prompt engineering for Indian legal context
        legal_prompt = f"""
        You are KanoonSahayak, an expert Indian legal assistant trained in Indian law.

        Respond as a knowledgeable Indian legal professional would when answering this question:

        {data.question}

        Provide specific references to Indian laws, statutes, or precedents where relevant.
        Be clear, precise, and practical in your response.
        Structure your answer in easy-to-understand language while maintaining legal accuracy.

        Legal response:
        """

        # Generate a response with the optimized prompt
        response = generate_text(legal_prompt.strip(), max_length=300)

        if not response:
            raise HTTPException(status_code=500, detail="No response from the legal language model.")

        # Extract just the response portion (after the prompt)
        generated_text = response[0]["generated_text"]

        # Find the "Legal response:" marker and extract content after it
        marker = "Legal response:"
        if marker in generated_text:
            answer = generated_text.split(marker, 1)[1].strip()
        else:
            # If marker not found, try to remove the prompt portion
            answer = generated_text.replace(legal_prompt.strip(), "").strip()

        # Clean up the response
        answer = answer.replace("\n\n\n", "\n\n").replace("\n\n", "\n").strip()

        # If answer is empty or too short after cleaning, provide a fallback
        if not answer or len(answer) < 10:
            answer = "I apologize, but I couldn't generate a proper legal response based on Indian law. Please try rephrasing your question with more specific details about your legal situation in India."

        return {"response": answer}
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return {"response": "I apologize for the technical difficulty. Our legal assistant is currently unable to process your request. Please try again in a few moments."}

# Generate Legal Notice Endpoint with optimized prompts
@app.post("/generate_notice/", response_model=NoticeResponse)
@response_cache()
async def generate_notice(data: NoticeData): # Now accepts 'data' which is a NoticeData object
    try:
        # Improved prompt with Indian legal context
        prompt = f"""
        You are drafting an official Indian legal notice. Generate a formal legal notice following standard Indian legal format with these details:

        RECIPIENT: {data.recipient_name}
        ADDRESS: {data.recipient_address}
        SUBJECT: {data.subject}
        NOTICE TYPE: {data.notice_type}
        JURISDICTION: {data.jurisdiction}
        CASE DETAILS: {data.case_details}
        SENDER: {data.your_name}

        Format this as a professional Indian legal document with:
        1. Current date
        2. Clear subject line
        3. Formal greeting
        4. Case details with relevant Indian legal statutes
        5. Clear demands or reliefs sought
        6. Timeline for compliance or response (typically 15-30 days)
        7. Consequences of non-compliance
        8. Professional signature block

        THE COMPLETE NOTICE TEXT:
        """

        response = generate_text(prompt.strip(), max_length=500)

        if not response:
            raise HTTPException(status_code=500, detail="No response from the legal language model.")

        # Extract the notice from after "THE COMPLETE NOTICE TEXT:" marker
        generated_text = response[0]["generated_text"]
        marker = "THE COMPLETE NOTICE TEXT:"

        if marker in generated_text:
            notice = generated_text.split(marker, 1)[1].strip()
        else:
            # Fallback if marker not found
            notice = generated_text.replace(prompt.strip(), "").strip()

        # Clean up the notice
        notice = notice.strip()

        # Add basic structure if the model didn't provide it
        if len(notice) < 100 or "NOTICE" not in notice.upper():
            current_date = "DATE: [Current Date]"

            notice = f"""
            LEGAL NOTICE

            {current_date}

            TO: {data.recipient_name}
            {data.recipient_address}

            RE: {data.subject}

            Dear {data.recipient_name},

            This is to formally notify you that this letter constitutes a legal notice under the laws of {data.jurisdiction}, regarding {data.subject}.

            {data.case_details}

            You are hereby requested to respond to this notice and comply with the above demands within 15 days of receipt, failing which I will be constrained to initiate appropriate legal proceedings against you, including but not limited to civil and/or criminal proceedings as applicable, without any further notice.

            This notice is being issued without prejudice to my other legal rights and remedies, which are expressly reserved.

            Sincerely,

            {data.your_name}
            """

        return {"notice": notice}
    except Exception as e:
        logger.error(f"Error generating notice: {str(e)}")
        return {"notice": "Error generating legal notice. Please try again with more specific details."}

# Legal Roadmap Generator with optimized prompts
@app.post("/roadmap/", response_model=RoadmapResponse)
@response_cache()
async def roadmap(data: RoadmapRequest): # Now accepts 'data' which is a RoadmapRequest object
    try:
        # Improved prompt with Indian legal context
        prompt = f"""
        Create a detailed Indian legal roadmap for handling '{data.issue_type}' in {data.jurisdiction}.

        This roadmap should:
        - Follow Indian legal procedures and systems
        - Include specific references to relevant Indian laws, courts, and authorities
        - Provide practical step-by-step guidance that a person can follow
        - Cover all stages from initial assessment to resolution
        - Include approximate timelines based on {data.timeline} process
        - Mention documentation requirements at each stage
        - Address common challenges and how to overcome them
        - Include contact information types for relevant authorities
        - Specify when to seek professional legal help

        Format the response as a clear, numbered list of concrete steps.

        THE ROADMAP STEPS:
        """

        response = generate_text(prompt.strip(), max_length=500)

        if not response:
            raise HTTPException(status_code=404, detail="No roadmap generated.")

        # Extract the roadmap steps from after "THE ROADMAP STEPS:" marker
        generated_text = response[0]["generated_text"]
        marker = "THE ROADMAP STEPS:"

        if marker in generated_text:
            roadmap_text = generated_text.split(marker, 1)[1].strip()
        else:
            # Fallback if marker not found
            roadmap_text = generated_text.replace(prompt.strip(), "").strip()

        # Process into clear steps
        steps = []
        for line in roadmap_text.split("\n"):
            if line.strip():
                steps.append(line.strip())

        # If the model didn't provide clear steps, structure them with Indian context
        if len(steps) < 3:
            steps = [
                f"Step 1: Initial assessment of your {data.issue_type} situation under Indian law",
                f"Step 2: Gather necessary documentation including Aadhaar card, PAN card, and relevant evidence for {data.issue_type}",
                f"Step 3: Consult with an advocate specializing in {data.issue_type} matters in {data.jurisdiction}",
                f"Step 4: Draft and file appropriate petition/application with the relevant court or authority (District Court/High Court/National Commission as applicable)",
                f"Step 5: Pay the required court fees and ensure proper filing as per Civil Procedure Code requirements",
                f"Step 6: Attend hearings as scheduled and follow advocate's guidance",
                f"Step 7: Monitor progress through the Indian judicial system and prepare for potential appeals if necessary",
                f"Step 8: Follow the guidance of the legal professionals involved, respecting Indian law and court proceedings"
            ]

        return {"steps": steps, "jurisdiction": data.jurisdiction, "issue_type": data.issue_type}
    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        return {"steps": [], "jurisdiction": data.jurisdiction, "issue_type": data.issue_type}

# Multilingual Translation Endpoint - Working as before
@app.post("/translate/", response_model=TranslationResponse)
@response_cache()
async def translate_text(data: TranslationRequest): # Now accepts 'data' which is a TranslationRequest object
    try:
        translated_text = GoogleTranslator(source="auto", target=data.dest_lang).translate(data.text)
        return {"translated_text": translated_text, "source_text": data.text, "target_language": data.dest_lang}
    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {e}")

# Document Analysis Endpoint with enhanced QA and summarization
@app.post("/analyze_document/", response_model=DocumentAnalysisResponse)
async def analyze_document(file: UploadFile = File(...), request: DocumentAnalysisRequest = Depends()):
    try:
        start_time = time.time()
        file_bytes = await file.read()
        document_text = ""
        try:
            doc = fitz.open(stream=io.BytesIO(file_bytes), filetype="pdf")
            document_text = "\n".join(page.get_text("text") for page in doc)
        except Exception as e:
            logger.warning(f"Could not process PDF: {e}")
            try:
                document_text = io.BytesIO(file_bytes).read().decode("utf-8") #Try assuming it's a text file
            except Exception as e2:
                raise HTTPException(status_code=400, detail=f"Could not process document: {e}, {e2}") #Now it's bad

        document_length = len(document_text)

        qa_model = MODEL_CACHE.get("qa_model")
        summarizer = MODEL_CACHE.get("summarizer")

        answer = None
        confidence = None
        if request.query and qa_model:
            qa_input = {
                'question': request.query,
                'context': document_text
            }
            qa_response = qa_model(qa_input)
            answer = qa_response['answer']
            confidence = qa_response['score']

        summary = None
        if summarizer:
            summary_input = document_text
            try:
                summary_response = summarizer(summary_input) #, max_length=500, min_length=100, do_sample=False) #You can try this
                summary = summary_response[0]['summary_text'] if summary_response else None
            except Exception as e:
                logger.warning(f"Summarization failed: {e}")
                summary = "Summary could not be generated."
        else:
            summary = "Summarization model unavailable." #Useful for UI

        message = None
        if not qa_model and not summarizer:
            message = "No analysis models available."

        logger.info(f"Document analysis took {time.time() - start_time:.2f} seconds. Document length: {document_length}")

        return {
            "answer": answer,
            "confidence": confidence,
            "summary": summary,
            "document_length": document_length,
            "document_text": None, #Return document text? Security concerns?
            "message": message
        }
    except Exception as e:
        logger.exception(f"General error analyzing document: {e}") #Good to log the full exception!
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
