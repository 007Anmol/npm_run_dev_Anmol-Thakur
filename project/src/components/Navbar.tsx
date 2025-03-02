import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Document", path: "/document-analysis" },
    { name: "Case Law", path: "/case-law-retrieval" },
    { name: "Chatbot", path: "/legal-aid-chatbot" },
    { name: "Lawyers", path: "/lawyers" },
    { name: "News & Library", path: "/news-and-library" },
  ];

  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Scale className="h-10 w-10 text-white" />
            <span className="text-2xl font-extrabold">advocate.ai</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 overflow-x-auto flex-nowrap">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-base font-semibold px-3 py-2 rounded-md transition duration-300 ${
                  location.pathname === item.path
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-900">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-base font-semibold ${
                  location.pathname === item.path
                    ? "bg-indigo-700 rounded-md p-3"
                    : "hover:bg-indigo-800 rounded-md p-3"
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
