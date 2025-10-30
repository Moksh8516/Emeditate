"use client";

import { useEffect } from "react";
import { completeMagicLinkLogin, getIdToken } from "@/lib/firebaseClient";
import { API_URL } from "@/lib/config";
import AuthForm from "@/components/AuthForm";
import { useAuthModal } from "@/store/useAuthModel";
import api from "@/lib/axios";

export default function LoginOrCreateAccountPage() {
  const { mode } = useAuthModal();
  useEffect(() => {
    (async () => {
      const result = await completeMagicLinkLogin();
      if (result) {
        const idToken = await getIdToken();
        await api.post(
          `${API_URL}/firebase-login`,
          { provider: "email", credential: idToken },
          { withCredentials: true }
        );
        window.location.href = "/chat"; // or router.push("/chat")
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-2xl border border-gray-600 p-6">
        <AuthForm mode={mode} />
      </div>
    </div>
  );
}
