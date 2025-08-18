'use client';
// components/NotFoundPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Animated404 = () => {
  const [stars, setStars] = useState<star[]>([]);
  interface star{
    id: string;
    x: number;
    y: number;
    size: number;
    opacity: number;
  }

  // Generate random stars for the background
  useEffect(() => {
    const generatedStars:star[] = Array.from({ length: 150 }).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 to-gray-900">
      {/* Starry background */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1792&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl w-full"
        >
          {/* Floating 404 text */}
          <motion.div 
            className="relative mb-4"
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80">
              404
            </div>
          </motion.div>
          
          {/* Main content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Lost in Space?
            </h1>
            <p className="text-lg text-indigo-200 max-w-md mx-auto mb-8">
             {` Oops! The page you’re looking for doesn’t exist or may have been moved.`}
            </p>
          </motion.div>
          
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-xl text-white text-center font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🚀 Return to Home
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Animated404;