import React from "react";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 mr-2" />
              <span className="font-bold text-lg">LegalAssist AI</span>
            </div>
            <p className="text-indigo-200 text-sm">
              Democratizing legal guidance for underserved communities through
              AI-powered solutions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-indigo-200">
              <li>Document Analysis</li>
              <li>Case Law Retrieval</li>
              <li>Legal Aid Chatbot</li>
              <li>Privacy Protection</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-indigo-200">
              <li>Legal Guides</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-indigo-200">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@legalassist.ai</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 555-123-4567</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Justice Ave, Legal City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-800 mt-8 pt-8 text-center text-indigo-200">
          <p>
            &copy; {new Date().getFullYear()} LegalAssist AI. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
