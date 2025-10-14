import { API_URL } from "./lib/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com", // allow Google profile images
      "storage.googleapis.com",
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: API_URL, // Your VPS backend
  },
};

module.exports = nextConfig;
