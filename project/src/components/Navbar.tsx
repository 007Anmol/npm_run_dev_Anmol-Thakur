import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Scale className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">LegalAssist AI</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors">
              Home
            </Link>
            <Link to="/document-analysis" className="px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors">
              Document Analysis
            </Link>
            <Link to="/case-law-retrieval" className="px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors">
              Case Law Retrieval
            </Link>
            <Link to="/legal-aid-chatbot" className="px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors">
              Legal Aid Chatbot
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/document-analysis" 
              className="block px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Document Analysis
            </Link>
            <Link 
              to="/case-law-retrieval" 
              className="block px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Case Law Retrieval
            </Link>
            <Link 
              to="/legal-aid-chatbot" 
              className="block px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Legal Aid Chatbot
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;