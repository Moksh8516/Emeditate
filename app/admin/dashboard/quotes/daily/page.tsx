// app/admin/dashboard/quotes/daily/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { Loader } from "@/components/loader";
import { API_URL } from "@/lib/config";
import { MdRefresh, MdInfo, MdLanguage } from "react-icons/md";
import toast from "react-hot-toast";
import api from "@/lib/axios";

interface DailyQuoteResponse {
  id: string;
  imageUrl: string;
  translations: {
    text: string;
    author: string;
    place?: string;
    date: string;
  };
  lang: string;
  createdAt: string;
}

export default function DailyQuotePage() {
  const [dailyQuote, setDailyQuote] = useState<DailyQuoteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState("en");

  // Fetch daily quote
  const fetchDailyQuote = async (lang = "en") => {
    try {
      setLoading(true);
      const response = await api.get(`${API_URL}/quotes/dailyQuote`, {
        params: { lang },
      });

      if (response.data.success) {
        setDailyQuote(response.data.data);
        setSelectedLang(response.data.data.lang || lang);
      } else {
        toast.error(response.data.message || "Failed to fetch daily quote");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Fetch error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to fetch daily quote";
      toast.error(errorMsg);

      // If no quotes available, show empty state
      if (err.response?.status === 404) {
        setDailyQuote(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    fetchDailyQuote(lang);
  };

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="md" color="purple" text="Loading daily quote..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Head>
        <title>Daily Quote | Dashboard</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Daily Inspiration
          </h1>
          <p className="text-gray-600 mt-2">Your daily dose of wisdom</p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => fetchDailyQuote(selectedLang)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <MdRefresh className="mr-2" />
              Refresh Quote
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-300 p-1">
            {["en", "hi", "fr", "es", "de"].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedLang === lang
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Quote Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {dailyQuote ? (
            <>
              {dailyQuote.imageUrl && (
                <div className="h-64 overflow-hidden">
                  <img
                    src={dailyQuote.imageUrl}
                    alt="Quote visual"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        #{dailyQuote.id.slice(0, 8)}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <MdLanguage className="mr-1" />
                        {dailyQuote.lang.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl text-gray-400 mb-4"> </div>
                    <p className="text-xl text-gray-800 italic leading-relaxed mb-6">
                      {dailyQuote.translations.text ||
                        "No quote text available"}
                    </p>
                    <div className="text-4xl text-gray-400 transform rotate-180 mb-6">
                      {" "}
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-lg font-medium text-gray-900">
                        — {dailyQuote.translations.author || "Unknown"}
                      </p>
                      <div className="flex gap-2 justify-center">
                        {dailyQuote.translations.date && (
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(
                              dailyQuote.translations.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 italic font-semibold mt-2">
                          ,{dailyQuote.translations.place || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-gray-600 mb-2">
                    <MdInfo className="mr-2" />
                    <span className="text-sm font-medium">
                      Quote Information
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Quote ID:</span>
                      <span className="ml-2 text-gray-700 font-mono">
                        {dailyQuote.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Display Language:</span>
                      <span className="ml-2 text-gray-700">
                        {dailyQuote.lang.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-700">
                        {new Date(dailyQuote.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Original Date:</span>
                      <span className="ml-2 text-gray-700">
                        {dailyQuote.translations.date
                          ? new Date(
                              dailyQuote.translations.date
                            ).toLocaleDateString()
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">💭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Daily Quote Available
              </h3>
              <p className="text-gray-500 mb-6">
                There are no active quotes available for today. Please add some
                quotes first.
              </p>
              <a
                href="/admin/dashboard/quotes/create"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Your First Quote
              </a>
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            How the Daily Quote Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                📅 Daily Selection
              </h4>
              <p className="text-blue-700 text-sm">
                Each day at midnight, a random quote is selected from all active
                quotes. The same quote is shown to everyone throughout the day.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                🌍 Multi-language
              </h4>
              <p className="text-blue-700 text-sm">
                {`Choose your preferred language. If a translation doesn't exist for your 
                selected language, the English version will be shown automatically.`}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                🔄 Refresh Note
              </h4>
              <p className="text-blue-700 text-sm">
                {` Clicking "Refresh Quote" will fetch the current day's quote again, 
                but won't change the quote until tomorrow.`}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                ✅ Active Quotes Only
              </h4>
              <p className="text-blue-700 text-sm">
                Only quotes marked as Active in the All Quotes section are
                eligible to be selected as the daily quote.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-2">
            API Response Structure
          </h4>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`{
  "id": "quote_id_here",
  "imageUrl": "image_url_or_empty_string",
  "translations": {
    "text": "The quote text here",
    "author": "Author name here",
    "date": "1997-11-02"
  },
  "lang": "en",
  "createdAt": "2024-01-16T05:14:41.544Z"
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
