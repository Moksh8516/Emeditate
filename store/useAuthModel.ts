import { create } from "zustand";

interface AuthModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

interface User {
  name: string;
  email: string;
  role: string;
  initial: string;
  profileImage?: string;
  dob?: string;
  age?: number;
}

interface AuthState {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  clearUser: () => set({ currentUser: null }),
}));
