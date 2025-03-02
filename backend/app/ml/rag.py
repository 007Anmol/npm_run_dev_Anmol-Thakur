import os
import glob
import logging
import chromadb
import numpy as np
import torch
from sentence_transformers import SentenceTransformer
from langchain.llms import HuggingFacePipeline
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.chains import RetrievalQA
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from datasets import load_dataset

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class RAGChatbot:
    def __init__(self, db_folder="db", model_name="sentence-transformers/all-MiniLM-L6-v2", llm_name="NousResearch/SOUL-7B-Instruct"):
        """Initialize the RAG system with embedding model, ChromaDB, and fine-tuned LLM."""
        self.db_folder = db_folder
        self.embedding_model = SentenceTransformer(model_name)
        self.vectorstore = None
        self.retriever = None
        self.llm_name = llm_name
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.llm_name)
            self.model = AutoModelForCausalLM.from_pretrained(self.llm_name, torch_dtype=torch.float16, device_map="auto")
            self.llm = HuggingFacePipeline(model=self.model, tokenizer=self.tokenizer)
            logging.info("✅ LLM model initialized successfully.")
        except Exception as e:
            logging.error(f"❌ Failed to load LLM model: {e}")
            raise e
        
        self._initialize_vectorstore()
        self._fine_tune_model()

    def _initialize_vectorstore(self):
        """Loads PDFs, creates document embeddings, and stores them in ChromaDB."""
        documents = []
        pdf_files = glob.glob(os.path.join(self.db_folder, "*.pdf"))
        
        if not pdf_files:
            logging.warning("⚠️ No PDFs found in the db folder!")
            return
        
        try:
            for pdf_path in pdf_files:
                loader = PyPDFLoader(pdf_path)
                documents.extend(loader.load())
            
            logging.info(f"📄 Loaded {len(documents)} pages from {len(pdf_files)} PDFs.")
            
            embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
            self.vectorstore = Chroma.from_documents(documents, embeddings)
            self.retriever = self.vectorstore.as_retriever()
            logging.info("✅ Vector database initialized!")
        except Exception as e:
            logging.error(f"❌ Error initializing vectorstore: {e}")
            raise e
    
    def _fine_tune_model(self):
        """Fine-tunes the SOUL-7B-Instruct model using PDF data."""
        try:
            dataset = load_dataset("text", data_files={"train": [os.path.join(self.db_folder, pdf) for pdf in os.listdir(self.db_folder) if pdf.endswith(".pdf")]})
            training_args = TrainingArguments(
                output_dir="./fine_tuned_soul7b",
                evaluation_strategy="epoch",
                save_strategy="epoch",
                per_device_train_batch_size=1,
                per_device_eval_batch_size=1,
                num_train_epochs=3,
                fp16=True
            )
            trainer = Trainer(
                model=self.model,
                args=training_args,
                train_dataset=dataset["train"]
            )
            logging.info("🔄 Fine-tuning SOUL-7B-Instruct...")
            trainer.train()
            self.model.save_pretrained("./fine_tuned_soul7b")
            self.tokenizer.save_pretrained("./fine_tuned_soul7b")
            logging.info("✅ Fine-tuning complete!")
        except Exception as e:
            logging.error(f"❌ Error during fine-tuning: {e}")
            raise e
    
    def retrieve_documents(self, query, top_k=5):
        """Retrieve top-k most relevant documents for a query."""
        if self.retriever is None:
            logging.warning("⚠️ No vector database initialized. Load PDFs first.")
            return []
        
        try:
            docs = self.retriever.get_relevant_documents(query, top_k=top_k)
            return [doc.page_content for doc in docs]
        except Exception as e:
            logging.error(f"❌ Error retrieving documents: {e}")
            return []

    def generate_response(self, query):
        """Retrieve relevant documents and generate a response using the fine-tuned LLM."""
        relevant_docs = self.retrieve_documents(query)
        
        if not relevant_docs:
            return "I'm sorry, I couldn't find relevant legal information."
        
        context = "\n".join(relevant_docs)
        final_prompt = f"Context:\n{context}\n\nUser Query: {query}\n\nAnswer:"
        
        try:
            return self.llm(final_prompt)
        except Exception as e:
            logging.error(f"❌ Error generating response: {e}")
            return "I'm sorry, an error occurred while generating a response."

    def save_vectorstore(self, path="./vectorstore"):
        """Saves the ChromaDB vectorstore."""
        if self.vectorstore:
            try:
                self.vectorstore.save_local(path)
                logging.info(f"✅ Vectorstore saved at {path}")
            except Exception as e:
                logging.error(f"❌ Error saving vectorstore: {e}")
    
    def load_vectorstore(self, path="./vectorstore"):
        """Loads a previously saved ChromaDB vectorstore."""
        if os.path.exists(path):
            try:
                self.vectorstore = Chroma.load_local(path, HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2"))
                self.retriever = self.vectorstore.as_retriever()
                logging.info("✅ Vectorstore loaded!")
            except Exception as e:
                logging.error(f"❌ Error loading vectorstore: {e}")
        else:
            logging.warning("⚠️ No saved vectorstore found.")

if __name__ == "__main__":
    chatbot = RAGChatbot()
    chatbot.save_vectorstore()
    chatbot.load_vectorstore()
    while True:
        user_query = input("Ask a legal question (or type 'exit' to quit): ")
        if user_query.lower() == 'exit':
            break
        response = chatbot.generate_response(user_query)
        print("🤖 Chatbot:", response)
