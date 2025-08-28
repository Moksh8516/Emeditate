import { useAuthModal } from "@/store/useAuthModel";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModal();

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const handleSignup = () => {
    window.location.href = "/api/auth/signup";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="p-6 pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-300 text-center text-sm mb-6">
                {"You've reached the guest limit. Please login or create a free account to continue."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6">
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-all mb-3 shadow-lg"
              >
                Log in
              </button>
              <button
                onClick={handleSignup}
                className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-all border border-gray-600"
              >
                Sign up for free
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}