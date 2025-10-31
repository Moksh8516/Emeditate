// lib/firebaseClient.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// Reusable login functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);
export const signInWithApple = () => signInWithPopup(auth, appleProvider);
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  return await user.getIdToken();
};

export async function sendMagicLink(email: string) {
  const actionCodeSettings = {
    // url: `${window.location.origin}/login-or-create-account`, // redirect here after email click
    url: `${window.location.origin}/login-or-create-account`, // redirect here after email click
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
}

export async function completeMagicLinkLogin() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      // Instead of prompt, notify user to re-enter email
      toast.error(
        "We couldn’t find your email. Please enter it again to continue."
      );
      return null;
    }

    try {
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      console.log("result", result);
      window.localStorage.removeItem("emailForSignIn");
      toast.success("Login successful!");
      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Magic link login failed:", err);
      toast.error("Login failed. Please try again.");
      return null;
    }
  }
  return null;
}
