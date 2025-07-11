"use client"
import { HeroBackgroundLineDesgin } from "@/components/HeroBackgroundLineDesgin";
import Image from "next/image";
import MyBackground from "@/components/MyBackground";
import Button from "@/components/Button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FaGooglePlay, FaAppStore, FaComments } from "react-icons/fa";
import { motion } from "motion/react";


 function Home() {
  return (
    <MyBackground>
      <Navbar />
      
      <div className="flex flex-col md:flex-row min-h-[85vh]">
        {/* Left Column - Hero Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <HeroBackgroundLineDesgin className="bg-transparent z-0 rounded-2xl overflow-hidden">
            <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
              {/* Profile Image with Glow Effect */}
              <div className="relative w-32 sm:w-40 md:w-44 lg:w-48 aspect-square z-10 mb-4 md:mb-6">
                <div className="absolute inset-0 rounded-full blur-xl animate-pulse"></div>
                <Image
                  className="rounded-full object-cover border-4 border-white/20 shadow-lg"
                  src="/heroImage.jpg"
                  alt="Sahaja Yoga AI"
                  fill
                  sizes="(max-width: 640px) 8rem, (max-width: 768px) 10rem, (max-width: 1024px) 13rem, 13rem"
                  priority
                />
              </div>

              {/* Animated Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-50"
              >
                Sahaja Yoga AI
              </motion.h1>

              {/* Description with Fade-in */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-base sm:text-lg md:text-xl text-gray-100 dark:text-slate-200 max-w-md mb-6 md:mb-8 leading-relaxed"
              >
                Spiritual AI companion guiding you to inner peace, clarity, and self-realization through Sahaja Yoga principles.
              </motion.p>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full max-w-md">
                <Button className="z-10 flex items-center gap-2 px-5 py-3 bg-gradient-to-r text-white from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <FaGooglePlay className="text-xl" />
                  <span>Android</span>
                </Button>
                
                <Button className="z-10 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-black hover:from-gray-800 hover:to-gray-700">
                  <FaAppStore className="text-xl text-white" />
                  <span className="text-white">iOS</span>
                </Button>
                
                <Link
                  className="z-10  items-center gap-2 px-5 py-3 hidden bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-200 dark:border-slate-700"
                  href={"/newChat"}
                >
                  <FaComments className="text-xl" />
                  <span>Chat Now</span>
                </Link>
              </div>
            </div>
          </HeroBackgroundLineDesgin>
        </div>
        
        {/* Right Column - Preview (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 p-8 items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-full">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center" >
                     <Image
                                src="/heroImage.jpg"
                                width={40}
                                height={40}
                                alt="Logo"
                                className="rounded-full w-10 h-auto "
                              />
                </div>
                </div>
                <div>
                  <h3 className="font-bold text-white">Sahaja Yoga AI</h3>
                  <p className="text-indigo-100 text-sm">Online • Ready to chat</p>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-4 h-96 overflow-y-auto flex flex-col gap-4">
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <p className="text-slate-700 dark:text-slate-200">{"Welcome! I'm here to guide you on your spiritual journey. How can I help you find peace today?"}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-indigo-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                  <p>How can I start with meditation?</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <p className="text-slate-700 dark:text-slate-200">{`Begin by finding a quiet space. Sit comfortably and focus on your breath. Let's start with 5 minutes of mindful breathing...`}</p>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Chat Prompt */}
      <div className="md:hidden fixed bottom-6 right-6 z-20">
        <Link
          href={"/newChat"}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg text-white hover:scale-110 transition-transform duration-300"
        >
          <FaComments className="text-2xl" />
        </Link>
      </div>
    </MyBackground>
  );
};

export default Home;