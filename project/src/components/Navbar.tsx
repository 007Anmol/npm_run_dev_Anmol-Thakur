import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Document", path: "https://rococo-platypus-5a27ac.netlify.app/", external : true },
    { name: "Case Law", path: "/case-law-retrieval" },
    { name: "Chatbot", path: "https://advocateai.pages.dev/", external: true },
    { name: "Lawyers", path: "/lawyers" },
    { name: "News & Library", path: "/news-and-library" },
  ];


  return (
    <nav className="bg-[#c2ad6acb] text-black shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Scale className="h-10 w-10 text-black" />
            <span className="text-2xl font-extrabold">advocate.ai</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  className={`text-base font-semibold px-3 py-2 rounded-md transition duration-300 hover:bg-[#D2B48C] hover:text-[#4B3621]`}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-semibold px-3 py-2 rounded-md transition duration-300 ${
                    location.pathname === item.path
                      ? "bg-[#C19A6B] text-white"
                      : "hover:bg-[#D2B48C] hover:text-[#4B3621]"
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black focus:outline-none"
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
        <div className="md:hidden bg-[#F5E6D8]">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-base font-semibold hover:bg-[#D2B48C] hover:text-[#4B3621] rounded-md p-3"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-base font-semibold ${
                    location.pathname === item.path
                      ? "bg-[#C19A6B] text-white rounded-md p-3"
                      : "hover:bg-[#D2B48C] hover:text-[#4B3621] rounded-md p-3"
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;