"use client";

import React from "react";
import { Scale } from "lucide-react";
import { motion } from "framer-motion";
import { WavyBackground } from "./WavyBackground";

const Hero: React.FC = () => {
  return (
    <WavyBackground
      colors={["#F5E6D8", "#EAD2B8", "#D2B48C", "#C19A6B"]}
      waveWidth={60}
      backgroundFill="white"
      speed="fast"
      waveOpacity={0.8}
      containerClassName="relative h-screen flex items-center justify-center text-center px-6 bg-white"
    >
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-black relative z-10 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-black text-center leading-tight">
          Democratizing Legal <br /> Guidance for AI
        </h1>
        <p className="mt-3 text-lg text-black font-bold text-center max-w-2xl">
          Our AI-driven legal assistance ecosystem provides accessible,
          unbiased, and ethically compliant support for underserved communities.
        </p>
        <div className="mt-5 flex gap-4">
          <button className="px-6 py-2 bg-[#C19A6B] text-black font-bold rounded-lg shadow-md hover:bg-[#6F4E37]">
            Explore Features
          </button>
          <button className="px-6 py-2 bg-[#F5E6D8] text-black font-semibold rounded-lg shadow-md hover:bg-[#D2B48C]">
            Learn More
          </button>
        </div>
      </motion.div>
    </WavyBackground>
  );
};

export default Hero;
