"use client";

import React from "react";
import { Scale } from "lucide-react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { WavyBackground } from "./WavyBackground"; // ✅ Import the fixed WavyBackground

const Hero: React.FC = () => {
  return (
    <WavyBackground
      colors={["#6A5ACD", "#483D8B", "#8A2BE2", "#9370DB"]} // ✅ Bluish & purplish theme
      waveWidth={60}
      backgroundFill="white"
      speed="fast"
      waveOpacity={0.8} // ✅ Now works without errors!
      containerClassName="relative h-screen flex items-center justify-center text-center px-6 bg-white"
    >
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-black relative z-10 max-w-3xl mx-auto" // Added max-w-3xl for text width
      >
        <h1 className="text-4xl font-bold text-black text-center leading-tight">
          Democratizing Legal <br /> Guidance for AI
        </h1>
        <p className="mt-3 text-lg text-black text-center max-w-2xl">
          Our AI-driven legal assistance ecosystem provides accessible,
          unbiased, and ethically compliant support for underserved communities.
        </p>
        <div className="mt-5 flex gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
            Explore Features
          </button>
          <button className="px-6 py-2 bg-gray-300 text-black font-semibold rounded-lg shadow-md hover:bg-gray-400">
            Learn More
          </button>
        </div>
      </motion.div>
    </WavyBackground>
  );
};

export default Hero;
