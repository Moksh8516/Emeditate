/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // optional if you use <img> tags
    domains: [
      "lh3.googleusercontent.com", // allow Google profile images
      "storage.googleapis.com",
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Your VPS backend
  },
};

module.exports = nextConfig;
