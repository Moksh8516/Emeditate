"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";

// Setup Axios interceptor once
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      router.push("/admin/login");
    } else {
      // Optionally, verify token by pinging the backend
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          // Already handled by interceptor
          setIsLoading(false);
        });
    }
  }, []);

  return { isLoading };
};
