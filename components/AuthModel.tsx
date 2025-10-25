// components/AuthModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { useAuthModal } from "@/store/useAuthModel";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const { isOpen, closeModal, setMode } = useAuthModal();
  const router = useRouter();

  const goToAuthPage = () => {
    closeModal();
    router.push("/login-or-create-account");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-1 rounded-full bg-gray-800/80"
            >
              <X size={20} />
            </button>

            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Continue the Conversation
              </h2>
              <p className="text-gray-300 text-sm mb-6">
                {
                  "You've reached the guest limit. Please login or create a free account to continue chatting."
                }
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setMode("login");
                    goToAuthPage();
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-300 py-3 rounded-lg font-medium text-gray-800 transition-all"
                  onChange={() => setMode("login")}
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMode("signup");
                    goToAuthPage();
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium text-white transition-all"
                >
                  Sign Up For Free
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
