/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useAuthModal } from "@/store/useAuthModel";
import { useAuthStore } from "@/store/useAuthModel";
import { API_URL } from "./config";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ send cookies
});

let isRefreshing = false;
let failedQueue: any[] = [];

// Helper to queue requests while refresh is ongoing
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      // ⚠️ Case 1: 403 → open login popup (Guest Limit / Forbidden)
      if (err.response?.status === 403) {
        const { openModal } = useAuthModal.getState();
        openModal(); // 🚀 Trigger login modal
        return Promise.reject(err);
      }

      // ⚠️ Case 2: 401 → expired or invalid token → refresh logic
      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        (err.response?.data?.message?.includes("Token expired") ||
          err.response?.data?.message?.includes("invalid token"))
      ) {
        originalRequest._retry = true;

        if (isRefreshing) {
          // Wait for ongoing refresh to complete
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (token)
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((error) => Promise.reject(error));
        }

        isRefreshing = true;

        try {
          // 🔁 Call refresh API
          const refreshResponse = await axios.post(
            `${API_URL}/refresh`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = refreshResponse.data.data;
          const { currentUser, setCurrentUser } = useAuthStore.getState();

          // 🧠 Update token in Zustand
          if (currentUser) {
            setCurrentUser({ ...currentUser });
          }

          // ✅ Process queued requests
          processQueue(null, accessToken);
          isRefreshing = false;

          // ✅ Retry failed request
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          isRefreshing = false;

          // ❌ Refresh failed → logout + open login modal
          const { clearUser } = useAuthStore.getState();
          const { openModal } = useAuthModal.getState();
          clearUser();
          openModal();
          return Promise.reject(refreshErr);
        }
      }

      // For all other errors, just reject
      return Promise.reject(err);
    }
  );
};

export default api;
