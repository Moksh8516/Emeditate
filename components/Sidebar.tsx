/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { IoIosArrowBack, IoMdTrash, IoMdMore } from "react-icons/io";
import { FaPlus, FaSignOutAlt, FaDownload, FaUserCircle } from "react-icons/fa";
import { GiLotus } from "react-icons/gi";
import {
  MdAlternateEmail,
  MdOutlineDriveFileRenameOutline,
} from "react-icons/md";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import { API_URL } from "@/lib/config";
import { useAuthModal, useAuthStore } from "@/store/useAuthModel";
import {
  ChatSession,
  groupSessionsByDate,
} from "@/lib/groupedSessionTimestamp";
import Image from "next/image";
import Button from "./Button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { currentUser, setCurrentUser, clearUser } = useAuthStore();
  const { closeModal, setMode } = useAuthModal();
  // State
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ======================
  // Fetch Sessions
  // ======================
  const fetchSessions = useCallback(
    async (pageNum: number) => {
      if (!currentUser || (!hasMore && pageNum > 1) || loading) return;

      setLoading(true);
      try {
        const res = await axios.post(
          `${API_URL}/all-sessions?page=${pageNum}&limit=20`,
          {},
          { withCredentials: true }
        );

        if (!res.data.success) throw new Error("Failed to fetch sessions");

        const { sessions, pagination } = res.data.data;
        setChatHistory((prev) =>
          pageNum === 1 ? sessions : [...prev, ...sessions]
        );
        setHasMore(!!pagination?.hasMore);
        setInitialLoad(false);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
        if (pageNum === 1) toast.error("Failed to load chat history");
      } finally {
        setLoading(false);
      }
    },
    [currentUser, hasMore, loading]
  );

  // Initial load
  useEffect(() => {
    if (currentUser) {
      fetchSessions(1);
    } else {
      setChatHistory([]);
      setHasMore(false);
      setInitialLoad(false);
    }
  }, [currentUser, fetchSessions]);

  // Infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasMore || loading || initialLoad) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        setPage((p) => {
          const nextPage = p + 1;
          fetchSessions(nextPage);
          return nextPage;
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, initialLoad, fetchSessions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(null);
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  // ======================
  // Navigation & Actions
  // ======================
  const navigateToChat = useCallback(
    (sessionId: string) => {
      localStorage.setItem("sessionId", sessionId);
      router.push(`/c/${sessionId}`);
      onClose();
    },
    [router, onClose]
  );

  const createNewSession = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/new`,
        {},
        { withCredentials: true }
      );
      const newSession = res.data.data;
      setChatHistory((prev) => [newSession, ...prev]);
      navigateToChat(newSession.sessionId);
      toast.success("New chat started 🌿");
    } catch (error) {
      toast.error("Failed to start new chat");
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this chat?")) return;

    try {
      await axios.delete(`${API_URL}/delete-session/${id}`, {
        withCredentials: true,
      });
      setChatHistory((prev) => prev.filter((s) => s.sessionId !== id));

      if (window.location.pathname === `/c/${id}`) {
        router.push("/chat");
      }

      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const goToAuthPage = () => {
    closeModal();
    router.push("/login-or-create-account");
  };

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(session.sessionId);
    setRenameTitle(session.title);
  };

  const saveRename = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const newTitle = renameTitle.trim();
    if (!newTitle) return;

    try {
      await axios.patch(
        `${API_URL}/update-title/${id}`,
        { title: newTitle },
        { withCredentials: true }
      );
      setChatHistory((prev) =>
        prev.map((s) => (s.sessionId === id ? { ...s, title: newTitle } : s))
      );
      toast.success("Title updated");
    } catch (error) {
      toast.error("Failed to rename");
    } finally {
      setRenamingId(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("sessionId");
      setCurrentUser(null);
      clearUser();
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  // ======================
  // Render
  // ======================
  const groupedSessions = groupSessionsByDate(chatHistory);
  const currentSessionId =
    typeof window !== "undefined" ? localStorage.getItem("sessionId") : null;

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="fixed inset-0 z-50 w-80 bg-gray-900 border-r border-indigo-800/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-indigo-800/30 flex items-center justify-between bg-gray-800/50">
        <Link
          href="/chat"
          className="hover:bg-gray-600/30 py-2 px-3 rounded-lg flex items-center transition ease-in-out duration-150"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1 rounded-full mr-3">
              <GiLotus className="text-white text-lg" />
            </div>
            Sahaja Yoga AI
          </h2>
        </Link>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors text-indigo-300"
          aria-label="Close sidebar"
        >
          <IoIosArrowBack size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      {currentUser && (
        <div className="p-4 border-b border-indigo-800/30">
          <button
            onClick={createNewSession}
            className="w-full flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition shadow-md"
          >
            <FaPlus size={16} />
            New Chat
          </button>
        </div>
      )}

      {/* Chat History */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-2 custom-scrollbar"
      >
        {initialLoad && loading ? (
          <p className="px-3 py-4 text-sm text-gray-400">Loading chats...</p>
        ) : groupedSessions.length > 0 ? (
          groupedSessions.map(([label, sessions]) => (
            <div key={label} className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                {label}
              </h3>
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div key={session.sessionId} className="relative group">
                    {renamingId === session.sessionId ? (
                      <form
                        onSubmit={(e) => saveRename(session.sessionId, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-800"
                      >
                        <input
                          autoFocus
                          value={renameTitle}
                          onChange={(e) => setRenameTitle(e.target.value)}
                          className="flex-1 bg-transparent text-white text-sm outline-none border-b border-indigo-500 pb-1"
                          onBlur={() => setRenamingId(null)}
                          onKeyDown={(e) =>
                            e.key === "Escape" && setRenamingId(null)
                          }
                        />
                        <button
                          type="submit"
                          className="text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                          save
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenamingId(null)}
                          className="text-gray-500 hover:text-gray-300 ml-1"
                        >
                          ✕
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-gray-700/50">
                        <button
                          onClick={() => navigateToChat(session.sessionId)}
                          className={`flex-1 text-left truncate ${
                            currentSessionId === session.sessionId
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {session.title}
                        </button>

                        <div
                          className="relative flex items-center"
                          onMouseEnter={() =>
                            setHoveredSessionId(session.sessionId)
                          }
                          onMouseLeave={() => setHoveredSessionId(null)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMenuOpen((prev) =>
                                prev === session.sessionId
                                  ? null
                                  : session.sessionId
                              );
                            }}
                            className="text-gray-500 hover:text-gray-300 p-1 rounded hover:bg-gray-600/30 transition-colors"
                            aria-label="More options"
                          >
                            <IoMdMore
                              size={16}
                              className="transform rotate-90"
                            />
                          </button>

                          {hoveredSessionId === session.sessionId &&
                            !isMenuOpen && (
                              <div className="absolute right-0 bottom-full mb-2 bg-gray-700 text-xs text-gray-200 px-2 py-1 rounded whitespace-nowrap z-10">
                                More
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {isMenuOpen === session.sessionId && (
                      <div className="absolute right-2 top-full mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-indigo-700/50 z-20 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(session, e);
                            setIsMenuOpen(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/70 hover:text-white flex gap-2 items-center"
                        >
                          <MdOutlineDriveFileRenameOutline />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.sessionId, e);
                            setIsMenuOpen(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 flex gap-2 items-center"
                        >
                          <IoMdTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="px-3 py-4 text-xs text-gray-500 italic">No chats yet</p>
        )}

        {loading && page > 1 && (
          <div className="px-3 py-2 text-center text-sm text-gray-400">
            Loading more chats...
          </div>
        )}

        {!hasMore && page > 1 && chatHistory.length > 0 && (
          <div className="px-3 py-2 text-center text-xs text-gray-500">
            End of chats
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="relative p-4 border-t border-indigo-800/30 bg-gray-800/20">
        {currentUser ? (
          <div
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700/50 transition group"
          >
            {currentUser.profileImage ? (
              <Image
                src={currentUser.profileImage}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-gray-600 group-hover:border-indigo-400 transition"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                {currentUser.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs font-medium text-white leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-gray-400">Account options</p>
            </div>
            <motion.div
              animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
              className="text-gray-400"
            >
              <IoIosArrowBack size={14} />
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
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

        {isUserMenuOpen && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 pb-2 left-4 w-[calc(100%-2rem)] bg-gray-800 rounded-xl shadow-2xl border border-indigo-700/50 z-50 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              <h1 className="text-gray-300 w-full flex items-center gap-3 px-3 pt-2 pb-1 rounded-lg text-left">
                <MdAlternateEmail />
                <span>{currentUser.email}</span>
              </h1>
              <button
                onClick={() => {
                  toast("App download coming soon 📱");
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors"
              >
                <FaDownload size={16} />
                Download the App
              </button>
              <button
                onClick={() => {
                  toast("Profile settings opening...");
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors"
              >
                <FaUserCircle size={16} />
                Profile & Settings
              </button>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
              >
                <FaSignOutAlt size={16} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
        <p className="text-center text-xs p-1 mt-2 text-gray-100">
          © {new Date().getFullYear()} Sahaja Yoga. All rights reserved.
        </p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
