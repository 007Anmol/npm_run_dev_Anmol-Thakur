import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Info,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  FileText,
  MapPin,
  User,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
  documentType?: "legal-notice" | "roadmap" | "lawyer-referral";
}

// Configuration for Hugging Face API
interface HuggingFaceConfig {
  model: string;
  apiToken: string;
  apiUrl: string;
}

// Synthetic lawyer database (this would typically come from a real database)
interface Lawyer {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  experience: number;
  location: string;
  language: string[];
}

const syntheticLawyers: Lawyer[] = [
  {
    id: "L001",
    name: "Adv. Rajesh Kumar",
    phone: "+91-9876543210",
    specialization: "Family Law",
    experience: 15,
    location: "Delhi",
    language: ["Hindi", "English"],
  },
  {
    id: "L002",
    name: "Adv. Priya Sharma",
    phone: "+91-9876543211",
    specialization: "Criminal Law",
    experience: 12,
    location: "Mumbai",
    language: ["Hindi", "English", "Marathi"],
  },
  {
    id: "L003",
    name: "Adv. Sunil Verma",
    phone: "+91-9876543212",
    specialization: "Property Law",
    experience: 20,
    location: "Bangalore",
    language: ["English", "Kannada"],
  },
  {
    id: "L004",
    name: "Adv. Meena Patel",
    phone: "+91-9876543213",
    specialization: "Corporate Law",
    experience: 10,
    location: "Ahmedabad",
    language: ["Gujarati", "Hindi", "English"],
  },
  {
    id: "L005",
    name: "Adv. Arun Singh",
    phone: "+91-9876543214",
    specialization: "Labor Law",
    experience: 8,
    location: "Kolkata",
    language: ["Bengali", "Hindi", "English"],
  },
  {
    id: "L006",
    name: "Adv. Lakshmi Nair",
    phone: "+91-9876543215",
    specialization: "Consumer Law",
    experience: 9,
    location: "Chennai",
    language: ["Tamil", "English"],
  },
  {
    id: "L007",
    name: "Adv. Vikram Malhotra",
    phone: "+91-9876543216",
    specialization: "Tax Law",
    experience: 14,
    location: "Hyderabad",
    language: ["Telugu", "Hindi", "English"],
  },
  {
    id: "L008",
    name: "Adv. Fatima Begum",
    phone: "+91-9876543217",
    specialization: "Civil Law",
    experience: 11,
    location: "Lucknow",
    language: ["Urdu", "Hindi", "English"],
  },
];

const huggingFaceConfig: HuggingFaceConfig = {
  model: "vishnun0027/Llama-3.2-1B-Instruct-Indian-Law",
  apiToken: "YOUR_HUGGING_FACE_TOKEN", // Replace this with your actual token
  apiUrl:
    "https://api-inference.huggingface.co/models/vishnun0027/Llama-3.2-1B-Instruct-Indian-Law",
};

const LegalAidChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your comprehensive legal assistant specializing in Indian law. I can help with questions, create legal notices, explain procedures, and provide lawyer referrals. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<
    "general" | "notice" | "roadmap" | "referral"
  >("general");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to generate chat prompt for the model
  const generatePrompt = (
    conversation: Message[],
    currentMode: string = mode
  ) => {
    // Format the conversation history for the LLM with specific instructions based on mode
    let systemPrompt = "";

    if (currentMode === "general") {
      systemPrompt = `You are a helpful legal assistant specializing in Indian law. Provide accurate, ethical, and helpful responses. Cite relevant laws, sections, acts, and sources when possible. Format your response professionally with bullet points for steps and procedures. If asked about a legal process or procedure, always provide a clear step-by-step roadmap. Your responses should be detailed, practical, and actionable.`;
    } else if (currentMode === "notice") {
      systemPrompt = `You are a legal document assistant specializing in creating professional legal notices under Indian law. Create a properly formatted legal notice based on the user's situation. Include all necessary components such as date, sender details (use placeholder if not provided), recipient details (use placeholder if not provided), subject line, factual background, legal basis with specific sections and acts, demand/request with timeline, consequences of non-compliance, closing, and signature placeholder. Format it as a proper legal document. Use formal and precise language.`;
    } else if (currentMode === "roadmap") {
      systemPrompt = `You are a legal process expert specializing in Indian law. Create a detailed procedural roadmap for the user's legal situation. Your roadmap should include: 1) A timeline with estimated durations for each step, 2) Which authorities/courts to approach at each stage, 3) Required documents with formatting guidelines, 4) Applicable fees and costs, 5) Potential challenges and how to overcome them, 6) Alternative approaches if available, 7) Legal provisions that govern each step. Format your response as a clear, numbered roadmap with main steps and sub-steps.`;
    } else if (currentMode === "referral") {
      systemPrompt = `You are a legal referral specialist. Based on the user's case details, provide appropriate lawyer referrals from your database. Consider the case type, location, language needs, and complexity when making referrals. Provide a brief explanation of why each lawyer would be suitable for this specific case. Always recommend consulting these lawyers for professional legal advice.`;
    }

    let prompt = `${systemPrompt}\n\n`;

    // Add relevant conversation history to the prompt (last 5 messages maximum to avoid token limits)
    const relevantHistory = conversation.slice(-10);
    relevantHistory.forEach((msg) => {
      if (msg.sender === "user") {
        prompt += `Human: ${msg.text}\n`;
      } else {
        // Only include the bot's text, not the metadata
        prompt += `Assistant: ${msg.text}\n`;
      }
    });

    // Add the latest user message
    prompt += `Human: ${inputText}\nAssistant:`;

    return prompt;
  };

  // Function to extract potential sources from the AI response
  const extractSources = (text: string) => {
    // This is a simple extraction logic - you might need to refine this
    // based on how the model actually formats sources
    const sourceRegex = /Source:?\s*\[(.*?)\]\((.*?)\)/g;
    const sources = [];
    let match;

    while ((match = sourceRegex.exec(text)) !== null) {
      sources.push({
        title: match[1].trim(),
        url: match[2].trim(),
      });
    }

    // If no sources in markdown format, look for source references in text
    if (sources.length === 0) {
      const simpleSourceRegex = /(Source|Reference):?\s*(.*?)(?:\n|$)/g;
      while ((match = simpleSourceRegex.exec(text)) !== null) {
        if (match[2].includes("http")) {
          const parts = match[2].split(" - ");
          if (parts.length > 1) {
            sources.push({
              title: parts[0].trim(),
              url: parts[1].trim(),
            });
          } else {
            sources.push({
              title: "Reference",
              url: match[2].trim(),
            });
          }
        } else {
          // Add non-URL sources with placeholder URL
          sources.push({
            title: match[2].trim(),
            url: "#",
          });
        }
      }
    }

    // Citations in the format [Section X of Act Y]
    const citationRegex =
      /\[(Section|Chapter|Article|Rule)\s+(\d+[A-Za-z]?)\s+of\s+(.*?)\]/g;
    while ((match = citationRegex.exec(text)) !== null) {
      const citation = match[0];
      const section = `${match[1]} ${match[2]} of ${match[3]}`;

      // Generate a placeholder URL for the citation
      // In a real app, you'd link to the actual legal code
      const url = `https://indiacode.nic.in/search/${encodeURIComponent(
        match[3]
      )}`;

      sources.push({
        title: section,
        url: url,
      });
    }

    // Clean up the response text by removing source references
    let cleanedText = text;
    sources.forEach((source) => {
      cleanedText = cleanedText.replace(
        `Source: [${source.title}](${source.url})`,
        ""
      );
      cleanedText = cleanedText.replace(
        `Source: ${source.title} - ${source.url}`,
        ""
      );
      cleanedText = cleanedText.replace(`Reference: ${source.title}`, "");
    });

    return {
      cleanedText: cleanedText.trim(),
      sources: sources.length > 0 ? sources : undefined,
    };
  };

  // Function to detect if the user is asking for a legal notice
  const detectUserIntent = (
    userMessage: string
  ): "general" | "notice" | "roadmap" | "referral" => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for legal notice creation request
    if (
      (lowerMessage.includes("draft") ||
        lowerMessage.includes("create") ||
        lowerMessage.includes("write") ||
        lowerMessage.includes("prepare")) &&
      (lowerMessage.includes("notice") ||
        lowerMessage.includes("legal document") ||
        lowerMessage.includes("letter") ||
        lowerMessage.includes("complaint"))
    ) {
      return "notice";
    }

    // Check for procedural roadmap request
    if (
      (lowerMessage.includes("procedure") ||
        lowerMessage.includes("process") ||
        lowerMessage.includes("steps") ||
        lowerMessage.includes("how to") ||
        lowerMessage.includes("roadmap") ||
        lowerMessage.includes("guide")) &&
      (lowerMessage.includes("file") ||
        lowerMessage.includes("court") ||
        lowerMessage.includes("legal") ||
        lowerMessage.includes("case") ||
        lowerMessage.includes("complaint") ||
        lowerMessage.includes("petition"))
    ) {
      return "roadmap";
    }

    // Check for lawyer referral request
    if (
      (lowerMessage.includes("lawyer") ||
        lowerMessage.includes("attorney") ||
        lowerMessage.includes("advocate") ||
        lowerMessage.includes("legal counsel") ||
        lowerMessage.includes("legal advice")) &&
      (lowerMessage.includes("recommend") ||
        lowerMessage.includes("refer") ||
        lowerMessage.includes("find") ||
        lowerMessage.includes("need") ||
        lowerMessage.includes("contact") ||
        lowerMessage.includes("who"))
    ) {
      return "referral";
    }

    return "general";
  };

  // Function to find relevant lawyers based on user query
  const findRelevantLawyers = (query: string): Lawyer[] => {
    const lowerQuery = query.toLowerCase();

    // Extract potential location from query
    const indianCities = [
      "delhi",
      "mumbai",
      "bangalore",
      "kolkata",
      "chennai",
      "hyderabad",
      "ahmedabad",
      "pune",
      "lucknow",
      "jaipur",
      "chandigarh",
      "kochi",
    ];
    let location = "";
    indianCities.forEach((city) => {
      if (lowerQuery.includes(city)) {
        location = city.charAt(0).toUpperCase() + city.slice(1);
      }
    });

    // Extract potential legal specialization from query
    const legalAreas = {
      family: "Family Law",
      divorce: "Family Law",
      custody: "Family Law",
      criminal: "Criminal Law",
      crime: "Criminal Law",
      fir: "Criminal Law",
      property: "Property Law",
      "real estate": "Property Law",
      land: "Property Law",
      corporate: "Corporate Law",
      business: "Corporate Law",
      company: "Corporate Law",
      labor: "Labor Law",
      worker: "Labor Law",
      employment: "Labor Law",
      consumer: "Consumer Law",
      complaint: "Consumer Law",
      product: "Consumer Law",
      tax: "Tax Law",
      gst: "Tax Law",
      "income tax": "Tax Law",
      civil: "Civil Law",
    };

    let specialization = "";
    for (const [keyword, area] of Object.entries(legalAreas)) {
      if (lowerQuery.includes(keyword)) {
        specialization = area;
        break;
      }
    }

    // Filter lawyers based on extracted criteria
    let filteredLawyers = [...syntheticLawyers];

    if (location) {
      filteredLawyers = filteredLawyers.filter(
        (lawyer) => lawyer.location.toLowerCase() === location.toLowerCase()
      );
    }

    if (specialization) {
      filteredLawyers = filteredLawyers.filter(
        (lawyer) => lawyer.specialization === specialization
      );
    }

    // If no specific matches, return a diverse set of lawyers
    if (filteredLawyers.length === 0) {
      // Return 3 lawyers with different specializations
      return syntheticLawyers.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    // Return up to 3 relevant lawyers
    return filteredLawyers.slice(0, 3);
  };

  // Function to format lawyer referrals as text
  const formatLawyerReferrals = (lawyers: Lawyer[], query: string): string => {
    let formattedText = `Based on your case regarding "${query.trim()}", here are some legal professionals who may be able to assist you:\n\n`;

    lawyers.forEach((lawyer, index) => {
      formattedText += `${index + 1}. **${lawyer.name}**\n`;
      formattedText += `   Specialization: ${lawyer.specialization}\n`;
      formattedText += `   Experience: ${lawyer.experience} years\n`;
      formattedText += `   Location: ${lawyer.location}\n`;
      formattedText += `   Languages: ${lawyer.language.join(", ")}\n`;
      formattedText += `   Contact: ${lawyer.phone}\n\n`;
    });

    formattedText +=
      "DISCLAIMER: These are synthetic lawyer profiles for demonstration purposes only. In a real application, you would provide actual verified lawyer information. Always verify credentials before engaging legal services.";

    return formattedText;
  };

  // Function to query the Hugging Face model
  const queryHuggingFaceModel = async (prompt: string) => {
    try {
      const response = await fetch(huggingFaceConfig.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${huggingFaceConfig.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract the generated text from the response
      // The exact path might vary depending on the API response structure
      let generatedText = data[0]?.generated_text || "";

      // If the model returns the full conversation, extract just the assistant's response
      const assistantPrefix = "Assistant: ";
      if (generatedText.includes(assistantPrefix)) {
        generatedText = generatedText.split(assistantPrefix).pop() || "";
      }

      return generatedText;
    } catch (error) {
      console.error("Error querying Hugging Face model:", error);
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Detect the user's intent
    const detectedMode = detectUserIntent(inputText);
    setMode(detectedMode);

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      let responseText = "";
      let documentType = undefined;

      // Handle lawyer referral requests differently
      if (detectedMode === "referral") {
        const relevantLawyers = findRelevantLawyers(inputText);
        responseText = formatLawyerReferrals(relevantLawyers, inputText);
        documentType = "lawyer-referral";
      } else {
        // Generate prompt for the model based on conversation history and detected mode
        const prompt = generatePrompt([...messages, userMessage], detectedMode);

        // Get response from Hugging Face model
        responseText = await queryHuggingFaceModel(prompt);

        // Set document type based on mode
        if (detectedMode === "notice") documentType = "legal-notice";
        if (detectedMode === "roadmap") documentType = "roadmap";
      }

      // Extract potential sources and clean the text
      const { cleanedText, sources } = extractSources(responseText);

      // Create bot response
      const botResponse: Message = {
        id: messages.length + 2,
        text: cleanedText,
        sender: "bot",
        timestamp: new Date(),
        sources: sources,
        documentType: documentType as any,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error handling message:", error);

      // Fallback response in case of error
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getIconForDocumentType = (documentType?: string) => {
    switch (documentType) {
      case "legal-notice":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "roadmap":
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case "lawyer-referral":
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getDocumentTypeLabel = (documentType?: string) => {
    switch (documentType) {
      case "legal-notice":
        return "Legal Notice";
      case "roadmap":
        return "Procedural Roadmap";
      case "lawyer-referral":
        return "Lawyer Referrals";
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <MessageSquare className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Indian Legal Aid Chatbot
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get comprehensive legal assistance, document drafting, procedural
          roadmaps, and lawyer referrals.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
            <div className="bg-green-600 text-white px-6 py-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h2 className="font-medium">Indian Legal Assistant</h2>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender === "user"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.documentType && (
                        <div className="mb-2 flex items-center">
                          {getIconForDocumentType(message.documentType)}
                          <span className="text-xs font-medium ml-1">
                            {getDocumentTypeLabel(message.documentType)}
                          </span>
                        </div>
                      )}

                      <div className="whitespace-pre-line">{message.text}</div>

                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          <p className="text-xs font-medium">Sources:</p>
                          {message.sources.map((source, index) => (
                            <a
                              key={index}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {source.title}
                            </a>
                          ))}
                        </div>
                      )}

                      <div
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-green-200"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>

                      {message.sender === "bot" && (
                        <div className="mt-2 flex items-center space-x-2">
                          <button className="p-1 rounded-full hover:bg-gray-200">
                            <ThumbsUp className="h-3 w-3 text-gray-500" />
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-200">
                            <ThumbsDown className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your legal question or request..."
                  className="flex-grow border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white rounded-r-lg py-2 px-4 hover:bg-green-700 transition-colors"
                  disabled={!inputText.trim() || isTyping}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">About This Chatbot</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  This AI assistant provides comprehensive legal assistance on
                  Indian law.
                </p>
              </div>
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  Create legal notices and formal documents based on your
                  situation.
                </p>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>Get step-by-step procedural roadmaps for legal processes.</p>
              </div>
              <div className="flex items-start">
                <User className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>Find relevant lawyer referrals based on your case needs.</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">
                Try These Requests
              </h3>
              <div className="space-y-2">
                <button
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    setInputText(
                      "Draft a legal notice for my landlord who is trying to evict me without proper notice"
                    )
                  }
                >
                  Create an eviction dispute notice
                </button>
                <button
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    setInputText(
                      "What's the procedure to file an FIR for theft in Delhi?"
                    )
                  }
                >
                  Get FIR filing procedure
                </button>
                <button
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    setInputText(
                      "Recommend a property lawyer in Mumbai for a land dispute case"
                    )
                  }
                >
                  Find a property lawyer
                </button>
                <button
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    setInputText(
                      "What's the process for filing a consumer complaint against an e-commerce company?"
                    )
                  }
                >
                  Consumer complaint process
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAidChatbot;
