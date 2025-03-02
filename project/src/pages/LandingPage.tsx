import React from "react";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import {
  FileText,
  BookOpen,
  MessageSquare,
  Users,
  Shield,
  Zap,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlining legal processes while protecting privacy and ensuring
              ethical compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Legal Document Analysis"
              description="AI-powered analysis of legal documents with plain-language explanations of complex legal terms and implications."
              icon={FileText}
              link="/document-analysis"
              color="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
            />
            <FeatureCard
              title="Case Law Retrieval"
              description="Intelligent search and retrieval of relevant case law and statutes to support legal research and decision-making."
              icon={BookOpen}
              link="/case-law-retrieval"
              color="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
            />
            <FeatureCard
              title="Legal Aid Chatbot"
              description="Ethical AI chatbot providing legal guidance with bias mitigation and transparent sourcing of information."
              icon={MessageSquare}
              link="/legal-aid-chatbot"
              color="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose advocate.ai?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our mission is to bridge the justice gap by making legal
              assistance accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Designed for underserved communities with intuitive interfaces
                and plain language explanations.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy Protection</h3>
              <p className="text-black">
                Robust privacy measures to protect sensitive legal information
                and user data.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ethical AI</h3>
              <p className="text-black">
                Bias mitigation and hallucination reduction for reliable and
                trustworthy legal guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What People Are Saying
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Hear from those who have benefited from our AI-driven legal
              assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  alt="Testimonial author"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Aarti Sharma</h4>
                  <p className="text-gray-600 text-sm">Community Advocate</p>
                </div>
              </div>
              <p className="text-black">
                "Advocate AI has transformed how our community accesses legal
                help. The document analysis tool made complex lease agreements
                understandable for everyone."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  alt="Testimonial author"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Ravi Gupta</h4>
                  <p className="text-black text-sm">Legal Aid Volunteer</p>
                </div>
              </div>
              <p className="text-black">
                "The case law retrieval system has been invaluable for our pro
                bono work. It finds relevant precedents in seconds that would
                have taken hours to research manually."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  alt="Testimonial author"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Aisha Sharma</h4>
                  <p className="text-black text-sm">Small Business Owner</p>
                </div>
              </div>
              <p className="text-black">
                "As a small business owner, I couldn't afford traditional legal
                services. The AI chatbot helped me understand my regulatory
                obligations and saved me thousands in consulting fees."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
