import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Info, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
}

// Configuration for Hugging Face API
interface HuggingFaceConfig {
  model: string;
  apiToken: string;
  apiUrl: string;
}

const huggingFaceConfig: HuggingFaceConfig = {
  model: "vishnun0027/Llama-3.2-1B-Instruct-Indian-Law",
  apiToken: "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", // Replace this with your actual token
  apiUrl: "https://api-inference.huggingface.co/models/vishnun0027/Llama-3.2-1B-Instruct-Indian-Law"
};

const LegalAidChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your ethical legal assistant specialized in Indian law. I can help answer questions about common legal issues in India. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to generate chat prompt for the model
  const generatePrompt = (conversation: Message[]) => {
    // Format the conversation history for the LLM
    let prompt = "You are a helpful legal assistant specializing in Indian law. Provide accurate, ethical, and helpful responses. Cite relevant laws and sources when possible.\n\n";
    
    // Add conversation history to the prompt
    conversation.forEach(msg => {
      if (msg.sender === 'user') {
        prompt += `Human: ${msg.text}\n`;
      } else {
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
        url: match[2].trim()
      });
    }
    
    // If no sources in markdown format, look for source references in text
    if (sources.length === 0) {
      const simpleSourceRegex = /Source:?\s*(.*?)(?:\n|$)/g;
      while ((match = simpleSourceRegex.exec(text)) !== null) {
        if (match[1].includes("http")) {
          const parts = match[1].split(" - ");
          if (parts.length > 1) {
            sources.push({
              title: parts[0].trim(),
              url: parts[1].trim()
            });
          } else {
            sources.push({
              title: "Reference",
              url: match[1].trim()
            });
          }
        }
      }
    }
    
    // Clean up the response text by removing source references
    let cleanedText = text;
    sources.forEach(source => {
      cleanedText = cleanedText.replace(`Source: [${source.title}](${source.url})`, "");
      cleanedText = cleanedText.replace(`Source: ${source.title} - ${source.url}`, "");
    });
    
    return { 
      cleanedText: cleanedText.trim(), 
      sources: sources.length > 0 ? sources : undefined 
    };
  };

  // Function to query the Hugging Face model
  const queryHuggingFaceModel = async (prompt: string) => {
    try {
      const response = await fetch(huggingFaceConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceConfig.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
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
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Generate prompt for the model based on conversation history
      const prompt = generatePrompt([...messages, userMessage]);
      
      // Get response from Hugging Face model
      const responseText = await queryHuggingFaceModel(prompt);
      
      // Extract potential sources and clean the text
      const { cleanedText, sources } = extractSources(responseText);
      
      // Create bot response
      const botResponse: Message = {
        id: messages.length + 2,
        text: cleanedText,
        sender: 'bot',
        timestamp: new Date(),
        sources: sources
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error handling message:", error);
      
      // Fallback response in case of error
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <MessageSquare className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Indian Legal Aid Chatbot</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get guidance on common legal issues in India with our AI assistant powered by Llama-3.2-1B-Instruct-Indian-Law.
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
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender === 'user' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
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
                      
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-green-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                      
                      {message.sender === 'bot' && (
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
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
                  placeholder="Type your legal question here..."
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
                <p>This AI assistant provides general legal information on Indian law, not legal advice.</p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>Powered by Llama-3.2-1B-Instruct-Indian-Law from Hugging Face.</p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>Sources are provided when available for verification and further reading.</p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>For specific legal advice, please consult with a qualified attorney in India.</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Suggested Topics</h3>
              <div className="space-y-2">
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("What are my rights if I'm facing eviction in India?")}
                >
                  Rental eviction rights
                </button>
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("How do I file an FIR in India?")}
                >
                  Filing an FIR
                </button>
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("What are my rights under the RTI Act?")}
                >
                  RTI Act information
                </button>
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("How do I file for divorce in India?")}
                >
                  Divorce procedures
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
