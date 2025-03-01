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

const LegalAidChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your ethical legal assistant. I can help answer questions about common legal issues. How can I assist you today?",
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

  const handleSendMessage = (e: React.FormEvent) => {
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
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse: Message;
      
      // Different responses based on user input
      if (inputText.toLowerCase().includes('eviction')) {
        botResponse = {
          id: messages.length + 2,
          text: "If you're facing eviction, you generally have the right to proper notice and a court hearing. The specific requirements vary by state, but landlords typically must provide written notice before filing for eviction. During the eviction process, you have the right to defend yourself in court.\n\nSome common defenses include improper notice, retaliation, discrimination, uninhabitable conditions, or failure to make necessary repairs.",
          sender: 'bot',
          timestamp: new Date(),
          sources: [
            {
              title: "HUD.gov - Tenant Rights",
              url: "https://www.hud.gov/topics/rental_assistance/tenantrights"
            },
            {
              title: "Legal Aid Society - Eviction Defense",
              url: "https://www.legalaidnetwork.org/eviction-defense"
            }
          ]
        };
      } else if (inputText.toLowerCase().includes('disability') || inputText.toLowerCase().includes('accommodation')) {
        botResponse = {
          id: messages.length + 2,
          text: "Under the Americans with Disabilities Act (ADA) and Fair Housing Act, individuals with disabilities are entitled to reasonable accommodations in housing, employment, and public services. A reasonable accommodation is a change in rules, policies, or procedures to accommodate a person with a disability.\n\nTo request an accommodation, you should:\n1. Make the request in writing when possible\n2. Explain the disability-related need for the accommodation\n3. Be specific about what accommodation you're requesting",
          sender: 'bot',
          timestamp: new Date(),
          sources: [
            {
              title: "ADA.gov - Reasonable Accommodations",
              url: "https://www.ada.gov/resources/reasonable-accommodations-information/"
            },
            {
              title: "EEOC - Disability Discrimination",
              url: "https://www.eeoc.gov/disability-discrimination"
            }
          ]
        };
      } else {
        botResponse = {
          id: messages.length + 2,
          text: "I understand you're seeking legal information. To provide the most helpful guidance, could you please provide more specific details about your situation? For example, what type of legal issue are you dealing with (housing, employment, family law, etc.)? The more context you can provide, the better I can assist you.",
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 2000);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ethical Legal Aid Chatbot</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get guidance on common legal issues with our bias-mitigated AI assistant.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
            <div className="bg-green-600 text-white px-6 py-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h2 className="font-medium">Legal Assistant</h2>
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
                      
                      {message.sources && (
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
                <p>This AI assistant provides general legal information, not legal advice.</p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>All responses are generated with bias mitigation and ethical guidelines.</p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>Sources are provided for verification and further reading.</p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>For specific legal advice, please consult with a qualified attorney.</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Suggested Topics</h3>
              <div className="space-y-2">
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("What are my rights if I'm facing eviction?")}
                >
                  Eviction rights
                </button>
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("How do I request a reasonable accommodation for my disability?")}
                >
                  Disability accommodations
                </button>
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("What should I do if I'm experiencing workplace discrimination?")}
                >
                  Workplace discrimination
                </button>
                <button 
                  className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setInputText("How do I file for child support?")}
                >
                  Child support
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