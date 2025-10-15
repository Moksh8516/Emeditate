/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AuthForm.tsx
"use client";

import { useState } from "react";
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  getIdToken,
  sendMagicLink,
} from "@/lib/firebaseClient";
import { API_URL } from "@/lib/config";
import { FaGoogle, FaApple, FaSpinner } from "react-icons/fa";
import { HiMail, HiOutlineExclamationCircle } from "react-icons/hi";
import { SiFacebook } from "react-icons/si";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthModel";
import api from "@/lib/axios";

interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
}

export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuthStore();
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      await sendMagicLink(email);
      toast.success("We’ve sent you a login link. Check your inbox!");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send login link");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string, fn: any) => {
    try {
      setLoading(true);
      setError("");
      const result = await fn();
      await sendTokenToBackend(result.user, provider);
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setError(`Failed with ${provider} login`);
    } finally {
      setLoading(false);
    }
  };

  const sendTokenToBackend = async (user: any, provider: string) => {
    const idToken = await getIdToken();
    try {
      const res = await api.post(
        `${API_URL}/firebase-login`,
        { provider, credential: idToken },
        { withCredentials: true }
      );
      toast.success("successfully login");
      setCurrentUser(res.data.user || user);
      window.location.href = "/chat";
    } catch (err) {
      toast.error("login failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-white/70 text-sm">
          {mode === "login"
            ? "Sign in to continue your journey"
            : "Join us to get started"}
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-3 bg-red-400/20 text-red-100 rounded-lg text-sm border border-red-500/30 flex items-center"
        >
          <HiOutlineExclamationCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Email-only login form */}
      <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
        <div className="relative">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white/5 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all placeholder:text-white/40 pl-10"
            required
          />
          <HiMail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-indigo-500/20"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Sending Link...
            </>
          ) : (
            "Continue with Email"
          )}
        </motion.button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-gray-900 text-white/60 text-xs">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSocialLogin("google", signInWithGoogle)}
          disabled={loading}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center border border-white/10 hover:border-white/20"
        >
          <FaGoogle className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSocialLogin("facebook", signInWithFacebook)}
          disabled={loading}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center border border-white/10 hover:border-white/20"
        >
          <SiFacebook className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSocialLogin("apple", signInWithApple)}
          disabled={loading}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center border border-white/10 hover:border-white/20"
        >
          <FaApple className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
