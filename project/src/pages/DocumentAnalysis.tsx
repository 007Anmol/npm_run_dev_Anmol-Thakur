import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const DocumentAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyzeDocument = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAnalysisResults(
        "This legal document is a residential lease agreement. Key terms include:\n\n" +
        "1. Lease Term: 12 months starting January 1, 2025\n" +
        "2. Monthly Rent: $1,500 due on the 1st of each month\n" +
        "3. Security Deposit: $2,000 refundable upon move-out inspection\n" +
        "4. Late Fee: $50 if rent is paid after the 5th of the month\n" +
        "5. Early Termination: Requires 60 days notice and 2 months rent penalty\n\n" +
        "Potential concerns:\n" +
        "- The maintenance clause places excessive burden on tenant\n" +
        "- The entry notice period of 12 hours is shorter than most state requirements\n" +
        "- The automatic renewal clause may violate consumer protection laws in your state"
      );
    }, 3000);
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisComplete(false);
    setAnalysisResults(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Legal Document Analysis</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your legal document to receive a plain-language explanation of complex legal terms and implications.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {!analysisComplete ? (
          <div className="p-8">
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {file ? file.name : 'Drag and drop your document here'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {file 
                  ? `${(file.size / 1024).toFixed(2)} KB - ${file.type || 'Unknown type'}`
                  : 'Supports PDF, DOCX, and TXT files up to 10MB'
                }
              </p>
              
              {!file && (
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Browse Files
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
              
              {file && (
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={resetAnalysis}
                    className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleAnalyzeDocument}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
                  </button>
                </div>
              )}
            </div>
            
            {isAnalyzing && (
              <div className="mt-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-gray-700">Analyzing your document...</p>
                </div>
                <div className="mt-4 bg-gray-100 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Scanning document structure</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Identifying legal terminology</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mr-2"></div>
                      <span>Analyzing contractual obligations</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <div className="h-5 w-5 mr-2"></div>
                      <span>Generating plain language summary</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-medium text-gray-900">Analysis Complete</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Document Summary</h4>
              <p className="whitespace-pre-line text-gray-700">{analysisResults}</p>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <p className="text-sm text-yellow-700">
                    <strong>Disclaimer:</strong> This analysis is provided for informational purposes only and does not constitute legal advice. Please consult with a qualified attorney for specific legal guidance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={resetAnalysis}
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Analyze Another Document
              </button>
              <button
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download Analysis
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-3xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-bold mb-2">Upload Document</h3>
            <p className="text-gray-600">
              Upload any legal document in PDF, DOCX, or TXT format.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="font-bold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our AI analyzes the document, identifying key terms, obligations, and potential concerns.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h3 className="font-bold mb-2">Plain Language Results</h3>
            <p className="text-gray-600">
              Receive a clear explanation of the document in everyday language you can understand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;