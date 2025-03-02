import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import CaseLawRetrieval from "./pages/CaseLawRetrieval";
import LegalAidChatbot from "./pages/LegalAidChatbot";
import NewsAndLibrary from "./pages/NewsAndLibrary";
import LawList from "./pages/LawList";
import NewsAndHeadline from "./pages/NewsAndHeadline";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import IndianLegalCaseLibrary from "./pages/IndianLegalCaseLibrary";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/document-analysis" element={<DocumentAnalysis />} />
            <Route path="/case-law-retrieval" element={<CaseLawRetrieval />} />
            <Route path="/legal-aid-chatbot" element={<LegalAidChatbot />} />
            <Route path="/news-and-library" element={<NewsAndLibrary />} />
            <Route path="/law-list" element={<LawList />} />
            <Route path="/news-headlines" element={<NewsAndHeadline />} />
            <Route path="/legal-case-library" element={<IndianLegalCaseLibrary />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
