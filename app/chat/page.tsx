// app/chat/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaLeaf, FaFilePdf } from "react-icons/fa";
// FaBrain, FaMedal
import { BsMoonStars } from "react-icons/bs";
import { GiLotus } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
// import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/config";
import Link from "next/link";
// import { FiFileText } from "react-icons/fi";
// import { TypingEffect } from "@/components/TypingEffect";

type DocType = {
  metadata?: {
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

const ChatPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageType[]>([
    {
      text: "Namaste 🙏 I'm your Sahaja Yoga AI Assistant. How can I help you find inner peace today?",
      doc:[],
      isUser: false,
    },
  ]);

  const handleNavigate = () => {
    router.push("/");
  };

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

    const userMessage = { text: input, doc:[], isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    try {
      const res = await axios.post(`${API_URL}/chat`,{message:input})
      const data =  res.data.data;

      const pagecontent = data.chatResult.kwargs.content;
      setMessages((prev)=>[...prev, {text:pagecontent, doc:data.doc, isUser:false}])
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting to inner wisdom. Please try again.",
          doc:[],
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  // const quickPrompts = [
  //   "How to meditate?",
  //   "Find inner peace",
  //   "Overcome anxiety",
  //   "Life purpose",
  //   "Improve focus",
  //   "Chakra balancing",
  //   "how to get self-relization",
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-gray-100">
      {/* Animated Background
      <div className="fixed inset-0 overflow-hidden">
        <AnimatedBackground />
      </div> */}

      {/* Header */}
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-indigo-800/50 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
          <button
            className="p-2 rounded-full hover:bg-indigo-900/50 mr-2 transition-colors"
            onClick={handleNavigate}
          >
            <IoIosArrowBack className="text-indigo-300 text-xl" />
          </button>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1 rounded-full mr-3">
            <GiLotus className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Sahaja Yoga AI </h1>
            <p className="text-xs text-indigo-300 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online - Ready to guide you
            </p>
          </div>
          {/* <div className="ml-auto flex space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <FaBrain className="text-indigo-300" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <FaMedal className="text-indigo-300" />
            </button>
          </div> */}
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-140px)]">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-indigo-800/50 shadow-xl"
        >
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full mr-4">
              <GiLotus className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Journey to Self-Realization
              </h2>
              <p className="text-indigo-200">AI-guided spiritual growth</p>
            </div>
          </div>
          <p className="text-indigo-50 mb-4">
            Ask me about meditation techniques, overcoming anxiety, finding life
            purpose, or achieving mental clarity. I am here to guide your
            spiritual growth.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
              Mindfulness
            </span>
            <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
              Meditation
            </span>
            <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
              Self-Discovery
            </span>
            <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
              Inner Peace
            </span>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="mb-24 p-4 md:p-10">
          {messages.map((msg, index) =>{
              const [firstDoc, secondDoc] = msg.doc || [];
                const isDuplicate = firstDoc && secondDoc
                 && firstDoc?.metadata?.fileName === secondDoc?.metadata?.fileName;

            return(
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col mb-6 ${msg.isUser ? "items-end" : "items-start"}`}
    >
      <div className="flex items-end gap-2 max-w-full">
        {!msg.isUser && (
          <div className="self-end">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
              <GiLotus className="text-white text-sm" />
            </div>
          </div>
        )}

        <div
          className={`max-w-[85%] lg:max-w-[70%] rounded-3xl px-5 py-3 ${
            msg.isUser
              ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-br-none"
              : "bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-bl-none border border-gray-700"
          }`}
        >
          <div className="flex flex-wrap items-start" style={{ whiteSpace:"pre-wrap", wordBreak: 'break-word' }}>
            <div className={msg.isUser ? "text-indigo-50" : "text-gray-200"}>
              {msg.text}
            </div>
          </div>
          
                      {/* source Display */}
                  {!msg.isUser && firstDoc && (
                    <>
                    <div className="mt-4 text-sm text-gray-400">
                      <span className="flex gap-2 p-1">source : <Link href={firstDoc?.metadata?.source || "Unknown File"} target="_blank" className="flex gap-2 items-center"><FaFilePdf className="text-red-500 text-lg"/>PDF</Link></span>
                      fileName: {firstDoc?.metadata?.fileName || "N/A"} <br />
                      pageNumber: {firstDoc?.metadata?.details?.loc?.pageNumber || "N/A"}
                    </div>

                  {/* Additional Document Display */}
                  {secondDoc && !isDuplicate && (
                    <div className="mt-4 text-sm text-gray-400">
                      <span className="flex">source :- <Link href={secondDoc?.metadata?.source || "Unknown File"} target="_blank" className="flex gap-2 items-center"><FaFilePdf className="text-red-500"/>PDF</Link></span>
                      fileName :- {secondDoc?.metadata?.fileName || "N/A"} <br />
                      pageNumber :- {secondDoc?.metadata?.details?.loc?.pageNumber || "N/A"}
                    </div>
                  )}
                  </>
                )}
        </div>
      </div>
    </motion.div>
  )}
  )}
          {isLoading && (
            <div className="flex mb-6 justify-start">
              <div className="bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-3xl rounded-bl-none px-5 py-3 border border-gray-700">
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

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-900/0 pb-6 pt-12">
          <div className="max-w-4xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about meditation, peace, or self-discovery..."
                className="w-full bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-full px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-indigo-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full ${
                  isLoading || !input.trim()
                    ? "bg-gray-700 text-gray-500"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                }`}
              >
                <FaPaperPlane />
              </motion.button>
            </form>
            {/* Quick Prompts */}
            {/* <div className="relative my-2">
              <div
                className="flex overflow-x-auto no-scrollbar scroll-smooth gap-2 pb-3"
                style={{
                  scrollbarWidth: "none", 
                  WebkitOverflowScrolling: "touch",
                  scrollBehavior: "smooth",
                }}
              >
                {quickPrompts.map((prompt) => (
                  <motion.button
                    key={prompt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput(prompt)}
                    className="flex-shrink-0 text-sm bg-gray-800/50 text-indigo-200 rounded-full px-4 py-2 hover:bg-indigo-800/50 transition-colors border border-gray-700 backdrop-blur-sm"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div> */}

            <p className="text-center text-xs text-indigo-400/70 mt-3">
              Mindful AI assistant • Your journey to self-realization begins
              here
            </p>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed bottom-20 right-10 opacity-10 text-indigo-400 rotate-12">
        <FaLeaf className="w-32 h-32" />
      </div>
      <div className="fixed top-1/4 left-5 opacity-5 text-purple-400 -rotate-12">
        <BsMoonStars className="w-24 h-24" />
      </div>
    </div>
  );
};

export default ChatPage;
