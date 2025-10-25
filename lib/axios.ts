/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { useAuthModal } from "@/store/useAuthModel";
import { useAuthStore } from "@/store/useAuthModel";
import { API_URL } from "./config";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || API_URL,
  withCredentials: true, // 👈 always send cookies
});

// 🔄 Control refresh queue to prevent multiple refreshes
let isRefreshing = false;
let failedQueue: any[] = [];

// ✅ Process all queued requests after refresh completes
const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) reject(error);
    else resolve(api(originalRequest));
  });
  failedQueue = [];
};

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (!err || !err.response || !err.config) {
        return Promise.reject(err);
      }
      // console.log("calling");
      const originalRequest = err.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      // ⚠️ Case 1: Guest Limit / Forbidden → open login modal
      if (err.response?.status === 403) {
        const { openModal } = useAuthModal.getState();
        openModal();
        return Promise.reject(err);
      }
      console.log(err.response.data.message);
      // ⚠️ Case 2: Token expired or invalid
      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        err.response?.data?.message?.includes("Token expired")
      ) {
        originalRequest._retry = true;
        // If refresh is already in progress → queue this request
        // console.log("recieve");
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, originalRequest });
          });
        }

        isRefreshing = true;

        try {
          // 🔁 Call backend refresh endpoint (must set new cookies)
          await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });

          isRefreshing = false;
          // ✅ Retry original request
          // console.log("originalRequest", originalRequest);
          processQueue();
          return api(originalRequest);
        } catch (refreshErr) {
          isRefreshing = false;
          processQueue(refreshErr);

          // ❌ Refresh failed → clear user + open login modal
          const { clearUser } = useAuthStore.getState();
          const { openModal } = useAuthModal.getState();
          clearUser();
          openModal();

          return Promise.reject(refreshErr);
        }
      }

      // 🚫 Other errors
      return Promise.reject(err);
    }
  );
};

export default api;
