/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebaseClient.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import toast from "react-hot-toast";

// ✅ Initialize Firebase only in browser
let app: any = null;
if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  };

  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const auth = app ? getAuth(app) : null;

// ==============================
// 🔹 Providers
// ==============================
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

// ==============================
// 🔹 Utility Checks
// ==============================
export const isStandalone = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (typeof navigator !== "undefined" && (navigator as any).standalone === true)
  );
};

export const isInWebView = () => {
  if (typeof window === "undefined") return false;
  return /(FBAN|FBAV|Instagram|Line|WebView|wv)/i.test(navigator.userAgent);
};

// ==============================
// 🔹 Get Firebase ID Token
// ==============================
export const getIdToken = async () => {
  if (!auth?.currentUser) throw new Error("No user logged in");
  return await auth.currentUser.getIdToken();
};

// ==============================
// 🔹 Google Sign-In
// ==============================
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth!, googleProvider);
    const idToken = await result.user.getIdToken();
    return sendTokenToBackend("google", idToken);
  } catch (err: any) {
    toast.error("Google login failed");
    console.error(err);
  }
};

// ==============================
// 🔹 Facebook Sign-In
// ==============================
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth!, facebookProvider);
    const idToken = await result.user.getIdToken();
    return sendTokenToBackend("facebook", idToken);
  } catch (err: any) {
    toast.error("Facebook login failed");
    console.error(err);
  }
};

// ==============================
// 🔹 Apple Sign-In (handles WebView / PWA / Browser)
// ==============================
export const signInWithApple = async () => {
  try {
    if (isInWebView() || isStandalone()) {
      // In WebView or PWA → redirect flow
      await signInWithRedirect(auth!, appleProvider);
    } else {
      // Normal browser → popup flow
      const result = await signInWithPopup(auth!, appleProvider);
      const idToken = await result.user.getIdToken();
      return sendTokenToBackend("apple", idToken);
    }
  } catch (err: any) {
    toast.error("Apple login failed");
    console.error("Apple sign-in error:", err);
  }
};

// ✅ Handle redirect results (important for Apple on WebView)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth!);
    if (result && result.user) {
      const idToken = await result.user.getIdToken();
      return sendTokenToBackend("apple", idToken);
    }
  } catch (err) {
    console.error("Redirect sign-in error:", err);
  }
};

// ==============================
// 🔹 Email / Password Sign-In
// ==============================
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth!, email, password);
    const idToken = await result.user.getIdToken();
    return sendTokenToBackend("email", idToken);
  } catch (err: any) {
    toast.error("Email login failed");
    console.error(err);
  }
};

// ==============================
// 🔹 Magic Link Authentication
// ==============================
export async function sendMagicLink(email: string) {
  if (!auth) throw new Error("Auth not initialized");
  const actionCodeSettings = {
    url: `${window.location.origin}/login-or-create-account`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
}

export async function completeMagicLinkLogin() {
  if (!auth) return null;

  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      toast.error("Email not found. Please enter it again.");
      return null;
    }

    try {
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      window.localStorage.removeItem("emailForSignIn");
      const idToken = await result.user.getIdToken();
      return sendTokenToBackend("email", idToken);
    } catch (err: any) {
      console.error("Magic link login failed:", err);
      toast.error("Login failed. Please try again.");
      return null;
    }
  }
  return null;
}

// ==============================
// 🔹 Common Function: Send ID Token to Backend
// ==============================
async function sendTokenToBackend(provider: string, idToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/firebase-login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, credential: idToken }),
      }
    );

    if (!response.ok) throw new Error("Backend auth failed");
    const data = await response.json();
    toast.success(data.message || "Logged in successfully");
    return data;
  } catch (err) {
    toast.error("Backend verification failed");
    console.error("sendTokenToBackend error:", err);
    return null;
  }
}
