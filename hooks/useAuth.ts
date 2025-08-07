"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

// Add axios interceptor to handle 401 responses globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if any API call returns 401 (unauthorized)
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      setIsLoading(false);
  }, []);

  return { isLoading };
};
