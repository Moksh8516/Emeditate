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
  // ✅ Define only static paths for export
  async exportPathMap() {
    return {
      "/": { page: "/" },
      "/about": { page: "/about" },
      "/contact-us": { page: "/contact-us" },
      "/broadcast": { page: "/broadcast" },
      "/blog": { page: "/blog" },
    };
  },
};

export default nextConfig;
