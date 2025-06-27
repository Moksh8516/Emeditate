"use client";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaLeaf } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { GiLotus } from "react-icons/gi";
import { BsMoonStars } from "react-icons/bs";

const ChatPage = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [
      {
        text: "Namaste! I'm your Sahaja Yoga guide. How can I help you find inner peace today?",
        isUser: false,
      },
    ]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API response with spiritual guidance
    setTimeout(() => {
      const botResponses = [
        "Meditation helps calm the mind. Try sitting quietly for 5 minutes, focusing on your breath.",
        "True peace comes from within. Reflect on what brings you joy without external validation.",
        "Imagine a gentle stream washing away your thoughts. Visualize clarity flowing through you.",
        "Self-realization begins with self-acceptance. What qualities do you appreciate about yourself?",
        "Connect with nature today. Feel the earth beneath your feet and the air around you.",
        "Release tension by focusing on your crown chakra. Visualize a warm, golden light above your head.",
      ];

      const response =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 flex items-center border-b border-indigo-100">
        <button className="p-2 rounded-full hover:bg-indigo-100 mr-2">
          <IoIosArrowBack className="text-indigo-700 text-xl" />
        </button>
        <GiLotus className="text-indigo-600 text-xl mr-2" />
        <h1 className="text-xl font-semibold text-indigo-800">
          Inner Peace Guide
        </h1>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <GiLotus className="text-xl" />
              </div>
              <h2 className="text-xl font-bold">Journey to Self-Realization</h2>
            </div>
            <p className="opacity-90">
              Ask me about meditation techniques, overcoming anxiety, finding
              life purpose, or achieving mental clarity. I am here to guide your
              spiritual growth.
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-6 ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] lg:max-w-[70%] rounded-3xl px-5 py-3 ${
                  msg.isUser
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white text-gray-700 shadow-sm rounded-bl-none"
                }`}
              >
                <div className="flex items-start">
                  {!msg.isUser && (
                    <div className="mr-2 mt-1 text-indigo-500">
                      <GiLotus />
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex mb-6 justify-start">
              <div className="bg-white text-gray-700 shadow-sm rounded-3xl rounded-bl-none px-5 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-indigo-100 p-4 fixed bottom-0 w-full">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about meditation, peace, or self-discovery..."
            className="flex-1 border border-indigo-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ml-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-3 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
          >
            <FaPaperPlane className="text-lg" />
          </button>
        </form>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {[
            "Meditation tips",
            "Find inner peace",
            "Overcome anxiety",
            "Life purpose",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-3 py-1.5 hover:bg-indigo-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

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
