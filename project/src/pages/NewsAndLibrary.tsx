import React from "react";
import { Link } from "react-router-dom";

const NewsAndLibrary = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
        News & Library
      </h1>

      {/* Cards container - stacked vertically */}
      <div className="flex flex-col items-center gap-6">
        {/* Card 1: Law List */}
        <Link
          to="/law-list"
          className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8 text-center transform hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-indigo-800">Law List</h2>
          <p className="text-gray-600 mt-2">
            Explore a comprehensive list of laws and regulations.
          </p>
        </Link>

        {/* Card 2: News & Headlines */}
        <Link
          to="/news-headlines"
          className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8 text-center transform hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-indigo-800">
            News & Headlines
          </h2>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest legal news and headlines.
          </p>
        </Link>

        {/* Card 3: Legal Case Library */}
        <Link
          to="/legal-case-library"
          className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8 text-center transform hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-indigo-800">
            Legal Case Library
          </h2>
          <p className="text-gray-600 mt-2">
            Access a collection of important legal case studies.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default NewsAndLibrary;
