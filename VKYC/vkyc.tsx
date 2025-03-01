import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Camera, ShieldCheck } from "lucide-react";

export default function VideoKYC() {
  const [aadhaar, setAadhaar] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [kycSuccess, setKycSuccess] = useState(false);

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (aadhaar && livePhoto) {
      setKycSuccess(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl border border-gray-300">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-700">Legal Video KYC</h2>
        <p className="text-center text-gray-600 mb-6">Securely verify your identity for legal processes.</p>
        
        <div className="mb-4">
          <label className="block font-medium mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" /> Upload Aadhaar Card
          </label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaar)} className="block w-full border rounded p-2" />
        </div>
        {aadhaar && <img src={aadhaar} alt="Aadhaar Preview" className="w-full h-32 object-cover rounded mb-4 border border-gray-300" />}
        
        <div className="mb-4">
          <label className="block font-medium mb-2 flex items-center gap-2">
            <Camera className="w-5 h-5 text-gray-600" /> Upload Photo
          </label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLivePhoto)} className="block w-full border rounded p-2" />
        </div>
        {livePhoto && <img src={livePhoto} alt="Live Photo Preview" className="w-full h-32 object-cover rounded mb-4 border border-gray-300" />}
        
        <Button onClick={handleSubmit} className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg text-lg font-semibold">
          Submit for Verification
        </Button>
        
        {kycSuccess && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 text-center rounded-lg flex items-center justify-center gap-2 border border-green-300">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            <span className="font-semibold">Legal Video KYC is Successful!</span>
          </div>
        )}
        
        <p className="text-xs text-gray-500 text-center mt-4">By submitting, you agree to our <a href="#" className="text-blue-600 underline">Privacy Policy</a> and <a href="#" className="text-blue-600 underline">Terms of Use</a>.</p>
      </Card>
    </div>
  );
}
