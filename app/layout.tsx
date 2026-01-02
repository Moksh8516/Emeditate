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
    "Sahaja Yoga AI | eMeditate – Your Guide to Inner Silence & Self-Realization",

  description:
    "eMeditate is a Sahaja Yoga AI chatbot offering spiritual guidance from Shri Mataji’s talks and books to help you experience inner silence and self-realization.",

  keywords: [
    "eMeditate",
    "Sahaja Yoga",
    "AI meditation",
    "meditation chatbot",
    "guided meditation",
    "Shri Mataji",
    "self realization",
    "inner silence",
    "mindfulness",
    "stress relief",
    "sleep meditation",
    "meditation app India",
  ],

  authors: [{ name: "eMeditate", url: "https://chat.emeditate.ai" }],

  metadataBase: new URL("https://chat.emeditate.ai"),

  alternates: {
    canonical: "https://chat.emeditate.ai",
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Sahaja Yoga AI | eMeditate – Inner Silence & Self-Realization",
    description:
      "Guided Sahaja Yoga meditations and AI-powered spiritual coaching inspired by Shri Mataji.",
    url: "https://testing.emeditate.ai",
    siteName: "eMeditate",
    images: [
      {
        url: "/promoImage.jpeg",
        width: 1200,
        height: 630,
        alt: "eMeditate – Sahaja Yoga AI Meditation",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sahaja Yoga AI | eMeditate – Inner Silence & Self-Realization",
    description:
      "Experience Sahaja Yoga meditation with AI guidance inspired by Shri Mataji.",
    images: ["/promoImage.jpeg"],
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
        {/* JSON-LD structured data for WebSite + SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://chat.emeditate.ai/#website",
                  url: "https://chat.emeditate.ai",
                  name: "eMeditate",
                  description:
                    "Guided Sahaja Yoga meditations and AI coaching to reduce stress, improve sleep, and deepen spiritual growth.",
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://chat.emeditate.ai/chat?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://chat.emeditate.ai/#software",
                  name: "eMeditate",
                  url: "https://chat.emeditate.ai",
                  description:
                    "Sahaja Yoga guided meditations with AI assistance — available on Android, iOS and web.",
                  applicationCategory: "HealthApplication",
                  operatingSystem: "iOS, Android, Web",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
              ],
            }),
          }}
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
