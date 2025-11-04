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

// ✅ Only initialize Firebase once
let app;
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

// Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// 🔍 Detect if running in WebView (Flutter or in-app)
function isWebView() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor;
  const webViewKeywords = [
    "wv", // Android webview
    "FBAN",
    "FBAV", // Facebook app
    "Instagram", // Instagram in-app
    "Line/",
    "Twitter",
    "Snapchat",
    "CriOS", // common in-app browsers
    "Flutter", // Flutter WebView (often includes this)
  ];
  return webViewKeywords.some((keyword) => ua.includes(keyword));
}

// 🔁 Common login helper
async function signInWithProvider(provider: any) {
  if (!auth) throw new Error("Auth not initialized");

  try {
    if (isWebView()) {
      // Use redirect inside WebView
      await signInWithRedirect(auth, provider);
      // Handle redirect result after return
      const result = await getRedirectResult(auth);
      return result;
    } else {
      // Use popup on secure browsers
      const result = await signInWithPopup(auth, provider);
      return result;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    toast.error("Login failed. Please try again.");
    throw error;
  }
}

// 🔐 Exported functions
export const signInWithGoogle = () => signInWithProvider(googleProvider);
export const signInWithFacebook = () => signInWithProvider(facebookProvider);
export const signInWithApple = () => signInWithProvider(appleProvider);

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth!, email, password);

export const getIdToken = async () => {
  if (!auth?.currentUser) throw new Error("No user logged in");
  return await auth.currentUser.getIdToken();
};

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
      toast.error("We couldn’t find your email. Please enter it again.");
      return null;
    }

    try {
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      window.localStorage.removeItem("emailForSignIn");
      toast.success("Login successful!");
      return result;
    } catch (err: any) {
      console.error("Magic link login failed:", err);
      toast.error("Login failed. Please try again.");
      return null;
    }
  }
  return null;
}
