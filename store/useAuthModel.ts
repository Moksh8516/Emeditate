import { create } from "zustand";
import { persist } from "zustand/middleware";
interface AuthModalState {
  isOpen: boolean;
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
  openModal: () => void;
  closeModal: () => void;
}

interface User {
  name: string;
  email: string;
  initial: string;
  phonenumber?: string;
  role?: string;
  profileImage?: string;
  dob?: string;
  age?: number;
}

interface AuthState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  mode: "login", // default
  setMode: (mode) => set({ mode }),
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
