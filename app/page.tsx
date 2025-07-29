"use client"

import Image from "next/image";
import MyBackground from "@/components/MyBackground";
import Button from "@/components/Button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FaGooglePlay, FaAppStore, FaComments, FaPaperPlane } from "react-icons/fa";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { GiLotus } from "react-icons/gi";

type DocType = {
  metaData?: {
    fileName?: string;
    source?: string;
    details?: {
      loc?: {
        pageNumber?: number;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type MessageType = {
  text: string;
  doc: DocType[];
  isUser: boolean;
};

function Home() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      text: "Namaste 🙏 I'm your Sahaja Yoga AI Assistant. How can I help you find inner peace today?",
      doc: [],
      isUser: false,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, doc: [], isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    try {
      const res = await axios.post(`${API_URL}/chat`, { message: input })
      const data = res.data.data;
      const pagecontent = data.chatResult.kwargs.content;
      setMessages((prev) => [...prev, { text: pagecontent, doc: data.doc, isUser: false }])
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting to inner wisdom. Please try again.",
          doc: [],
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MyBackground>
      <Navbar />

      <div className="flex flex-col md:flex-row justify-center min-h-[85vh]">
        {/* Left Column - Hero Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="flex flex-col justify-center items-center py-8 px-4 text-center">
            {/* Profile Image with Glow Effect */}
            <div className="relative w-32 sm:w-40 md:w-44 lg:w-48 align-middle aspect-square z-10 mb-4 md:mb-6">
              <div className="absolute inset-0 border-4 bg-gray-200 rounded-full blur-xl animate-pulse"></div>
              <Image
                className="rounded-full object-cover border-4 border-white/40 shadow-lg"
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
              Emeditate App
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
              <Button
                onClick={() => {
                  console.log("Opening Android app link");
                  window.open("https://play.google.com/store/apps/details?id=com.sahajayoga.emeditate", "_blank");
                }}
                Icon = {<FaGooglePlay className="text-xl" />}
                className="z-10 flex items-center gap-2 px-5 py-3 bg-gradient-to-r text-white from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
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
        </div>

        {/* Right Column - Preview (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 p-8 relative items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col h-[600px]">

            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-full">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center">
                    <Image
                      src="/heroImage.jpg"
                      width={40}
                      height={40}
                      alt="Logo"
                      className="rounded-full w-10 h-auto"
                    />
                  </div>
                </div>
                <div className="flex flex-col align-middle">
                  <h3 className="font-bold text-white">Sahaja Yoga AI</h3>
                  <p className="text-sm text-indigo-50 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online - Ready to guide you
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Chat Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {!msg.isUser && (
                      <div className="self-end">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-full">
                          <GiLotus className="text-white text-sm" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`rounded-3xl px-4 py-2 ${msg.isUser
                          ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-br-none"
                          : "bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-bl-none border border-gray-700"
                        }`}
                    >
                      <p className={msg.isUser ? "text-indigo-50" : "text-gray-200"}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-3xl rounded-bl-none px-4 py-2 border border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                      <span className="text-sm text-indigo-300">Reflecting...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at Bottom */}
            <div className="p-4 pt-6 flex-shrink-0">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about meditation, peace, or self-discovery..."
                  className="w-full bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-full px-5 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-indigo-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${isLoading || !input.trim()
                      ? "bg-gray-700 text-gray-500"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    }`}
                >
                  <FaPaperPlane />
                </motion.button>
              </form>
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