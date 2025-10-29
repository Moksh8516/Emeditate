import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // ✅ Required for Firebase static hosting
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com", "storage.googleapis.com"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
