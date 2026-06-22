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
    "Sahaja Yoga AI | emeditate.ai – Meditate for Inner Silence & Self-Realization",
  description:
    "Discover emeditate.ai, your Sahaja Yoga AI guide. Experience deep meditation, balance your energy centers, and achieve inner silence with insights from Shri Mataji’s teachings.",
  keywords: [
    "emeditate",
    "meditate",
    "meditation",
    "sahaja yoga",
    "sahaja yoga meditation",
    "inner silence",
    "self realization",
    "meditation AI",
    "spiritual growth",
    "online meditation guide",
  ],
  alternates: {
    // CRITICAL: Point this exactly to your active subdomain where the app is indexed
    canonical: "https://chat.emeditate.ai",
  },
  // Next.js maps assets in the public folder cleanly using this field
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sahaja Yoga AI | emeditate.ai – Deep Meditation & Inner Silence",
    description:
      "Your Sahaja Yoga AI guide to modern meditation, self-realization, and stress relief.",
    url: "https://chat.emeditate.ai",
    siteName: "emeditate.ai",
    images: [
      {
        url: "https://chat.emeditate.ai/favicon.ico", // Updated to subdomain
        width: 1200,
        height: 630,
        alt: "emeditate.ai - Sahaja Yoga AI Meditation Guide",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahaja Yoga AI | emeditate.ai",
    description:
      "Experience deep Sahaja Yoga meditation and inner peace with our AI guide.",
    images: ["https://chat.emeditate.ai/favicon.ico"], // Updated to subdomain
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 2. Schema.org Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "emeditate.ai",
    alternateName: ["Sahaja Yoga AI", "emeditate"],
    url: "https://chat.emeditate.ai",
    description:
      "An AI-powered spiritual guide offering Sahaja Yoga meditation techniques for inner silence and self-realization.",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    logo: "https://chat.emeditate.ai/favicon.ico",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61571190040367",
      "https://x.com/SSocials153546",
      "https://www.linkedin.com/in/sahaja-yoga-karnataka-64a340348",
      "https://www.instagram.com/sahajayogakarnatakaofficial",
      "https://www.youtube.com/@SahajaYogaKarnatakaOfficial",
      "https://in.pinterest.com/SahajaYogaKar",
    ],
    keyword: "meditation, meditate, sahaja yoga, emeditate, inner peace",
  };

  return (
    <html lang="en">
      <head>
        {/* Next.js automatically handles standard icons and tags from metadata, 
            but adding the structured data script helps Google parse your site context instantly */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
