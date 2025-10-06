import { useAuthModal } from "@/store/useAuthModel";
import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies
});

// Setup interceptors
export const setupInterceptors = () => {
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (
        (err.response?.status === 403 &&
          err.response?.data?.message?.includes("Guest limit")) ||
        err.response?.status === 401
      ) {
        const { openModal } = useAuthModal.getState();
        openModal(); // 🚀 Trigger login modal
      }
      return Promise.reject(err);
    }
  );
};

export default api;
