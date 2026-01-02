import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientWrapper from "@/components/ClientWrapper";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Sahaja Yoga AI | emeditate.ai – Your Guide to Inner Silence & Self-Realization",
  description:
    "emeditate.ai's Sahaja Yoga AI chatbot offers spiritual insights from Shri Mataji’s talks and books, guiding you to inner silence and self-realization.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sahaja Yoga AI",
    description:
      "emeditate.ai's Sahaja Yoga AI chatbot offers spiritual insights from Shri Mataji’s talks and books.",
    images: [
      {
        url: "/promoImage.jpeg", // ✅ promo icon for sharing
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahaja Yoga AI",
    description:
      "emeditate.ai's Sahaja Yoga AI chatbot offers spiritual insights from Shri Mataji’s talks and books.",
    images: ["/promoImage.jpeg"], // ✅ promo icon for Twitter/WhatsApp
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ClientWrapper />
        <Toaster
          position="bottom-right"
          toastOptions={{
            success: {
              style: {
                background: "green",
                color: "white",
              },
            },
            error: {
              style: {
                background: "red",
                color: "white",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
