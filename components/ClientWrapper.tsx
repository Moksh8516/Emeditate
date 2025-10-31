// app/ClientWrapper.tsx
"use client";

import { useEffect } from "react";
import { setupInterceptors } from "@/lib/axios";
import AuthModal from "@/components/AuthModel";
import { handleRedirectResult } from "@/lib/firebaseClient";

export default function ClientWrapper() {
  useEffect(() => {
    handleRedirectResult(); // handles Apple redirect cas
    setupInterceptors(); // setup axios interceptors only on client
  }, []);

  return <AuthModal />; // global modal always mounted
}
