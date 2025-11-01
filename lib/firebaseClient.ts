/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Auth,
} from "firebase/auth";
import toast from "react-hot-toast";

// 🔍 Detect if running inside a mobile WebView
export const isWebView = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Common WebView indicators
  return (
    /(WebView|wv|Android.*Chrome\/[.]* Mobile|iPhone.*Safari(?!.*Version)|Android.*Safari.*Mobile)/i.test(
      userAgent
    ) ||
    // Additional checks
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) || // iPad in some WebViews
    "standalone" in window.navigator // iOS PWA-like, but sometimes used in WebView wrappers
  );
};

// ✅ Initialize Firebase only in the browser
let app;
let authInstance: Auth | null = null;

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
  authInstance = getAuth(app);
}

export const auth = authInstance;

// 🔌 Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// 🚪 Sign-in functions (adaptive: popup in browser, redirect in WebView)
export const signInWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  if (isWebView()) {
    googleProvider.setCustomParameters({ prompt: "select_account" });
    return await signInWithRedirect(auth, googleProvider);
  }
  return await signInWithPopup(auth, googleProvider);
};

export const signInWithFacebook = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  if (isWebView()) {
    return await signInWithRedirect(auth, facebookProvider);
  }
  return await signInWithPopup(auth, facebookProvider);
};

export const signInWithApple = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  if (isWebView()) {
    return await signInWithRedirect(auth, appleProvider);
  }
  return await signInWithPopup(auth, appleProvider);
};

export const signInWithEmail = (email: string, password: string) => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  return signInWithEmailAndPassword(auth, email, password);
};

// 🪄 Magic Link (Email Link) Sign-in
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
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      // Fallback: ask user to enter email again (e.g., opened link on different device)
      const userInput = prompt("Please enter your email to complete login:");
      if (userInput) {
        email = userInput;
        window.localStorage.setItem("emailForSignIn", email);
      } else {
        toast.error("Email is required to complete login.");
        return null;
      }
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
      toast.error("Login failed. The link may be expired or invalid.");
      return null;
    }
  }
  return null;
}

// 🔑 Get ID token for backend verification
export async function getIdToken() {
  if (!auth?.currentUser) {
    throw new Error("No user is currently signed in.");
  }
  return await auth.currentUser.getIdToken();
}

// 🔄 Handle redirect result (for Google/Facebook/Apple in WebView)
export async function handleRedirectResult() {
  if (!auth) return null;

  try {
    const result = await getRedirectResult(auth);
    if (result) {
      toast.success("Login successful!");
      return result;
    }
    return null;
  } catch (error: any) {
    console.error("Redirect sign-in error:", error);
    let message = "Login failed. Please try again.";
    if (error.code === "auth/account-exists-with-different-credential") {
      message =
        "An account with this email already exists using a different sign-in method.";
    } else if (error.code === "auth/cancelled-popup-request") {
      message = "Login was cancelled.";
    }
    toast.error(message);
    return null;
  }
}
