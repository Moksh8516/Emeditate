'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';
import Navbar from '@/components/Navbar';
// Define message type
type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    const botResponse: Message = { sender: 'bot', text: `You said: "${input}"` };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInput('');
    if (!expanded) setExpanded(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white p-10">
    <Navbar/>
      {/* Full Chat Interface */}
      {expanded && (
        <main className="flex-1 overflow-y-auto p-6 space-y-4 md:space-y-6 transition-all duration-500 ease-in-out">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-xl shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-gray-800 text-white rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </main>
      )}

      {/* Initial Prompt Box */}
      {!expanded && (
        <div className="flex-1 flex items-center justify-center px-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-center max-w-md mb-10">
            Ask me anything...
          </h1>
        </div>
      )}

      {/* Input Area */}
      <footer className="bg-black/40 backdrop-blur-md p-4 border-t border-gray-700 transition-all duration-300">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 rounded-full outline-none bg-gray-800 text-white placeholder:text-gray-400 focus:bg-gray-700 transition"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </footer>
    </div>
    </>
  );
}