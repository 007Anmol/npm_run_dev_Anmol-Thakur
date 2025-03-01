import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get the current route

  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {" "}
          {/* Increased height */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Scale className="h-10 w-10 mr-3" /> {/* Increased logo size */}
              <span className="font-extrabold text-2xl">
                LegalAssist AI
              </span>{" "}
              {/* Bolder text */}
            </Link>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {" "}
            {/* More spacing */}
            {[
              { name: "Home", path: "/" },
              { name: "Document Analysis", path: "/document-analysis" },
              { name: "Case Law Retrieval", path: "/case-law-retrieval" },
              { name: "Legal Aid Chatbot", path: "/legal-aid-chatbot" },
              { name: "News & Library", path: "/news-and-library" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-3 rounded-md font-semibold text-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-indigo-700 text-white" // Active link color
                    : "hover:bg-indigo-800 hover:text-gray-200"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md hover:bg-indigo-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-900">
          <div className="px-4 pt-3 pb-5 space-y-3">
            {[
              { name: "Home", path: "/" },
              { name: "Document Analysis", path: "/document-analysis" },
              { name: "Case Law Retrieval", path: "/case-law-retrieval" },
              { name: "Legal Aid Chatbot", path: "/legal-aid-chatbot" },
              { name: "News & Library", path: "/news-and-library" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-md font-semibold text-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-indigo-700 text-white"
                    : "hover:bg-indigo-800 hover:text-gray-200"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
