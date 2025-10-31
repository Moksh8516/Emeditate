// app/ClientWrapper.tsx
"use client";

import { useEffect } from "react";
import { setupInterceptors } from "@/lib/axios";
import AuthModal from "@/components/AuthModel";

export default function ClientWrapper() {
  useEffect(() => {
    setupInterceptors(); // setup axios interceptors only on client
  }, []);

  return <AuthModal />; // global modal always mounted
}
