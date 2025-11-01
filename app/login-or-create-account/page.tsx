"use client";
import { useEffect } from "react";
import {
  completeMagicLinkLogin,
  handleRedirectResult,
  getIdToken,
} from "@/lib/firebaseClient";
import { API_URL } from "@/lib/config";
import AuthForm from "@/components/AuthForm";
import { useAuthModal } from "@/store/useAuthModel";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginOrCreateAccountPage() {
  const { mode } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      // 1. Handle magic link (email-based login)
      const magicResult = await completeMagicLinkLogin();
      if (magicResult) {
        await exchangeTokenAndRedirect();
        return;
      }

      // 2. Handle OAuth redirect (for WebView)
      const redirectResult = await handleRedirectResult();
      if (redirectResult) {
        await exchangeTokenAndRedirect();
        return;
      }
    };

    const exchangeTokenAndRedirect = async () => {
      try {
        const idToken = await getIdToken();
        await api.post(
          `${API_URL}/firebase-login`,
          {
            provider: "firebase", // or extract from result
            credential: idToken,
          },
          { withCredentials: true }
        );
        router.push("/chat");
      } catch (err) {
        console.error("Token exchange failed:", err);
        toast.error("Authentication failed. Please log in again.");
      }
    };

    initAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-2xl border border-gray-600 p-6">
        <AuthForm mode={mode} />
      </div>
    </div>
  );
}
