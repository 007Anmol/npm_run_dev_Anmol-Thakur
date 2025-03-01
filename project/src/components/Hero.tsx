"use client";
import React from "react";
import { Scale } from "lucide-react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { WavyBackground } from "./WavyBackground"; // Import the updated WavyBackground

const Hero: React.FC = () => {
  return (
    <WavyBackground
      colors={["#6A5ACD", "#483D8B", "#8A2BE2", "#9370DB"]} // Bluish and purplish theme
      waveWidth={60}
      backgroundFill="white"
      speed="fast"
      blur={15}
      waveOpacity={0.5}
      containerClassName="relative h-screen flex items-center justify-center text-center px-6 bg-white"
    >
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-gray-900 relative z-10"
      >
        <div className="flex items-center space-x-3">
          <Scale className="h-12 w-12 text-blue-500" />
          <h1 className="text-3xl font-extrabold">LegalAssist AI</h1>
        </div>

        {/* Typewriter Effect */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold mt-6 text-gray-800"
        >
          <Typewriter
            words={["Democratizing Legal Guidance for All"]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
          />
        </motion.h2>

        <p className="text-lg text-gray-600 max-w-2xl mt-4">
          Our AI-driven legal assistance ecosystem provides accessible,
          unbiased, and ethically compliant support for underserved communities.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4">
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="#features"
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition"
          >
            Explore Features
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="#about"
            className="px-6 py-3 border border-blue-500 text-blue-500 font-medium rounded-lg hover:bg-blue-100 transition"
          >
            Learn More
          </motion.a>
        </div>
      </motion.div>
    </WavyBackground>
  );
};

export default Hero;
