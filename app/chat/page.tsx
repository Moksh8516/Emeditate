/* eslint-disable @typescript-eslint/no-unused-vars */
// app/chat/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaLeaf, FaYoutube } from "react-icons/fa";
import { BsMoonStars } from "react-icons/bs";
import { GiLotus } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { useAuthModal, useAuthStore } from "@/store/useAuthModel";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
export type DocType = {
  metadata?: {
    title?: string;
    url?: string;
    type?: string;
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
      doc: [],
      isUser: false,
    },
  ]);

  const { currentUser, setCurrentUser } = useAuthStore();
  const { closeModal, setMode } = useAuthModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const goToAuthPage = () => {
    closeModal();
    router.push("/login-or-create-account");
  };

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
      const res = await api.post(`${API_URL}/auth-chat`, { message: input });
      const data = res.data.data;
      console.log("api response", data);
      const pagecontent = data.chatResult.kwargs.content;
      setMessages((prev) => [
        ...prev,
        { text: pagecontent, doc: data.doc, isUser: false },
      ]);
      router.push(`/c/${data.sessionId}`);
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

  const handleSignOut = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      router.push("/");
      setCurrentUser(null);
      toast.success("logout successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("failed to signout user");
    }
  };

  console.log("current user", currentUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-indigo-800/50 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-indigo-900/50 mr-2 transition-colors"
              aria-label="Open sidebar"
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
          </div>

          {/* User Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {currentUser.profileImage ? (
                  <>
                    <img
                      src={currentUser.profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                    <span>{currentUser.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {currentUser.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span>{currentUser.name}</span>
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-indigo-700/50 z-50">
                  <div className="px-4 py-2 border-b border-indigo-700/30">
                    <p className="text-sm text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-indigo-300 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Handle profile navigation
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-900/50 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-900/50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="md:flex gap-2 hidden">
              <Button
                onClick={() => {
                  setMode("login");
                  goToAuthPage();
                }}
              >
                Login
              </Button>
              <Button
                variant="dark"
                onClick={() => {
                  setMode("signup");
                  goToAuthPage();
                }}
              >
                Signup for free
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-2 md:px-4 py-8 min-h-[calc(100vh-200px)] pb-32">
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

        {/* chat container */}
        <div className="mb-12 sm:mb-20">
          {messages.map((msg, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col mb-6 ${msg.isUser ? "items-end" : "items-start"}`}
              >
                <div className="flex items-end gap-2 max-w-full">
                  {/* Bot Avatar */}
                  {!msg.isUser && (
                    <div className="self-end">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                        <GiLotus className="text-white text-sm" />
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-3xl px-5 py-3 ${
                      msg.isUser
                        ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-br-none"
                        : "bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-bl-none border border-gray-700"
                    }`}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {/* 📝 Normal Text (if no videos) */}
                    <div
                      className={
                        msg.isUser ? "text-indigo-50" : "text-gray-200"
                      }
                    >
                      {msg.text}
                    </div>

                    {/* 🎥 Video Response */}
                    {msg.doc &&
                      msg.doc.length > 0 &&
                      msg.doc[0].metadata?.type === "video" && (
                        <div className="my-4 w-full max-w-2xl">
                          {/* First video card */}
                          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-indigo-300">
                                {msg.doc[0]?.metadata?.title}
                              </h3>
                            </div>
                            <div className="relative w-full pb-[56.25%]">
                              <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={
                                  msg.doc[0]?.metadata?.url
                                    ? msg.doc[0]?.metadata?.url.replace(
                                        "watch?v=",
                                        "embed/"
                                      )
                                    : ""
                                }
                                title={msg.doc[0]?.metadata?.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>

                          {/* Additional videos */}
                          {msg.doc.length > 1 && (
                            <div className="mt-4 bg-gray-800/70 rounded-xl p-3 border border-gray-700">
                              <h4 className="text-sm text-gray-300 mb-2">
                                More related videos:
                              </h4>
                              <ul className="space-y-2">
                                {msg.doc
                                  .slice(1)
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  .map((video: any, i: number) => (
                                    <li key={i}>
                                      <a
                                        href={video.metadata.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 flex gap-2 items-center hover:text-indigo-300 transition-colors"
                                      >
                                        <FaYoutube className="text-red-500 text-2xl" />{" "}
                                        {video.metadata.title}
                                      </a>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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

            <p className="text-center text-xs text-indigo-400/70 mt-3">
              Sahaja yoga AI assistant • Your journey to self-realization begins
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

// // app/chat/page.jsx
// "use client";
// import { useState, useEffect, useRef } from "react";
// import { FaPaperPlane, FaLeaf, FaYoutube } from "react-icons/fa";
// import { BsMoonStars } from "react-icons/bs";
// import { GiLotus } from "react-icons/gi";
// import { FiMenu } from "react-icons/fi"; // Changed from IoIosArrowBack to menu icon
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { API_URL } from "@/lib/config";
// import { useAuthStore } from "@/store/useAuthModel";
// import toast from "react-hot-toast";
// import Sidebar from "@/components/Sidebar"; // ✅ Import Sidebar

// export type DocType = {
//   metadata?: {
//     title?: string;
//     url?: string;
//     type?: string;
//     fileName?: string;
//     source?: string;
//     details?: {
//       loc?: {
//         pageNumber?: number;
//         [key: string]: unknown;
//       };
//       [key: string]: unknown;
//     };
//     [key: string]: unknown;
//   };
//   [key: string]: unknown;
// };

// type MessageType = {
//   text: string;
//   doc: DocType[];
//   isUser: boolean;
// };

// const ChatPage = () => {
//   const router = useRouter();
//   const [messages, setMessages] = useState<MessageType[]>([
//     {
//       text: "Namaste 🙏 I'm your Sahaja Yoga AI Assistant. How can I help you find inner peace today?",
//       doc: [],
//       isUser: false,
//     },
//   ]);

//   const { currentUser, setCurrentUser } = useAuthStore();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar state
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   console.log(currentUser?.profileImage);
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Handle form submit → create new session + redirect
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const sessionId = crypto.randomUUID();
//     // Redirect with prompt in URL
//     router.push(`/c/${sessionId}`);
//   };

//   // Reset input on mount
//   useEffect(() => {
//     setInput("");
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
//       router.push("/");
//       setCurrentUser(null);
//       toast.success("Logout successful");
//     } catch (error) {
//       toast.error("Failed to sign out");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-gray-100">
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         onNewChat={() => (window.location.href = "/chat")}
//       />

//       {/* Header */}
//       <header className="sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-indigo-800/50 z-40">
//         <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="p-2 rounded-full hover:bg-indigo-900/50 mr-2 transition-colors"
//               aria-label="Open sidebar"
//             >
//               <FiMenu className="text-indigo-300 text-xl" />{" "}
//               {/* ✅ Updated Icon */}
//             </button>
//             <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1 rounded-full mr-3">
//               <GiLotus className="text-white text-lg" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white">Sahaja Yoga AI</h1>
//               <p className="text-xs text-indigo-300 flex items-center">
//                 <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                 Online - Ready to guide you
//               </p>
//             </div>
//           </div>

//           {/* User Dropdown */}
//           {currentUser && (
//             <div className="relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 focus:outline-none"
//               >
//                 {currentUser.profileImage &&
//                 currentUser.profileImage.length > 0 ? (
//                   <>
//                     <img
//                       src={currentUser.profileImage}
//                       alt="Profile"
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         aspectRatio: "1",
//                         objectFit: "cover",
//                       }}
//                       className="rounded-full border-2 border-gray-300"
//                       onError={(e) => (e.currentTarget.style.display = "none")}
//                     />
//                     <span className="hidden md:block">{currentUser.name}</span>
//                   </>
//                 ) : (
//                   <>
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
//                       {currentUser.name?.charAt(0).toUpperCase() || "U"}
//                     </div>
//                     <span className="hidden md:block">{currentUser.name}</span>
//                   </>
//                 )}
//               </button>

//               {/* Dropdown Menu */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-indigo-700/50 z-50">
//                   <div className="px-4 py-2 border-b border-indigo-700/30">
//                     <p className="text-sm text-white truncate">
//                       {currentUser.name}
//                     </p>
//                     <p className="text-xs text-indigo-300 truncate">
//                       {currentUser.email}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setIsDropdownOpen(false);
//                     }}
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-900/50 transition-colors"
//                   >
//                     Profile
//                   </button>
//                   <button
//                     onClick={handleSignOut}
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-900/50 transition-colors"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="relative max-w-6xl mx-auto px-2 md:px-4 py-8 min-h-[calc(100vh-200px)] pb-32">
//         {/* Welcome Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-indigo-800/50 shadow-xl"
//         >
//           <div className="flex items-center mb-4">
//             <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full mr-4">
//               <GiLotus className="text-xl text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-white">
//                 Journey to Self-Realization
//               </h2>
//               <p className="text-indigo-200">AI-guided spiritual growth</p>
//             </div>
//           </div>
//           <p className="text-indigo-50 mb-4">
//             Ask me about meditation techniques, overcoming anxiety, finding life
//             purpose, or achieving mental clarity. I am here to guide your
//             spiritual growth.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
//               Mindfulness
//             </span>
//             <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
//               Meditation
//             </span>
//             <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
//               Self-Discovery
//             </span>
//             <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-xs text-indigo-200">
//               Inner Peace
//             </span>
//           </div>
//         </motion.div>

//         {/* Chat container */}
//         <div className="mb-12 sm:mb-20">
//           {messages.map((msg, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className={`flex flex-col mb-6 ${msg.isUser ? "items-end" : "items-start"}`}
//             >
//               <div className="flex items-end gap-2 max-w-full">
//                 {/* Bot Avatar */}
//                 {!msg.isUser && (
//                   <div className="self-end">
//                     <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
//                       <GiLotus className="text-white text-sm" />
//                     </div>
//                   </div>
//                 )}

//                 {/* Message Bubble */}
//                 <div
//                   className={`rounded-3xl px-5 py-3 ${
//                     msg.isUser
//                       ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-br-none"
//                       : "bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-bl-none border border-gray-700"
//                   }`}
//                   style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
//                 >
//                   <div
//                     className={msg.isUser ? "text-indigo-50" : "text-gray-200"}
//                   >
//                     {msg.text}
//                   </div>

//                   {/* 🎥 Video Response */}
//                   {msg.doc &&
//                     msg.doc.length > 0 &&
//                     msg.doc[0].metadata?.type === "video" && (
//                       <div className="my-4 w-full max-w-2xl">
//                         {/* First video card */}
//                         <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
//                           <div className="p-4">
//                             <h3 className="text-lg font-semibold text-indigo-300">
//                               {msg.doc[0]?.metadata?.title}
//                             </h3>
//                           </div>
//                           <div className="relative w-full pb-[56.25%]">
//                             <iframe
//                               className="absolute top-0 left-0 w-full h-full"
//                               src={
//                                 msg.doc[0]?.metadata?.url
//                                   ? msg.doc[0]?.metadata?.url.replace(
//                                       "watch?v=",
//                                       "embed/"
//                                     )
//                                   : ""
//                               }
//                               title={msg.doc[0]?.metadata?.title}
//                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                               allowFullScreen
//                             />
//                           </div>
//                         </div>

//                         {/* Additional videos */}
//                         {msg.doc.length > 1 && (
//                           <div className="mt-4 bg-gray-800/70 rounded-xl p-3 border border-gray-700">
//                             <h4 className="text-sm text-gray-300 mb-2">
//                               More related videos:
//                             </h4>
//                             <ul className="space-y-2">
//                               {msg.doc
//                                 .slice(1)
//                                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                                 .map((video: any, i: number) => (
//                                   <li key={i}>
//                                     <a
//                                       href={video.metadata.url}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="text-indigo-400 flex gap-2 items-center hover:text-indigo-300 transition-colors"
//                                     >
//                                       <FaYoutube className="text-red-500 text-2xl" />{" "}
//                                       {video.metadata.title}
//                                     </a>
//                                   </li>
//                                 ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-3xl rounded-bl-none px-4 py-2 border border-gray-700">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
//                   <div
//                     className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
//                     style={{ animationDelay: "0.2s" }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
//                     style={{ animationDelay: "0.4s" }}
//                   ></div>
//                   <span className="text-sm text-indigo-300">Reflecting...</span>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-900/0 pb-6 pt-12">
//           <div className="max-w-4xl mx-auto px-4">
//             <form onSubmit={handleSubmit} className="relative">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask about meditation, peace, or self-discovery..."
//                 className="w-full bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-full px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-indigo-300"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.9 }}
//                 type="submit"
//                 disabled={isLoading || !input.trim()}
//                 className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full ${
//                   isLoading || !input.trim()
//                     ? "bg-gray-700 text-gray-500"
//                     : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                 }`}
//               >
//                 <FaPaperPlane />
//               </motion.button>
//             </form>

//             <p className="text-center text-xs text-indigo-400/70 mt-3">
//               Sahaja Yoga AI Assistant • Your journey to self-realization begins
//               here
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* Floating Elements */}
//       <div className="fixed bottom-20 right-10 opacity-10 text-indigo-400 rotate-12">
//         <FaLeaf className="w-32 h-32" />
//       </div>
//       <div className="fixed top-1/4 left-5 opacity-5 text-purple-400 -rotate-12">
//         <BsMoonStars className="w-24 h-24" />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
