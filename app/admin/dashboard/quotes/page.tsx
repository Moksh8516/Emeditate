// app/admin/dashboard/quotes/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { Loader } from "@/components/loader";
import { API_URL } from "@/lib/config";
import {
  MdDeleteOutline,
  MdEditNote,
  MdVisibility,
  MdVisibilityOff,
  MdLanguage,
} from "react-icons/md";
import { FaPlus, FaSearch } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// types/quotes.ts
export interface QuoteTranslation {
  text: string;
  author: string;
  date: string;
}

export interface Quote {
  id: string;
  imageUrl: string;
  enabled: boolean;
  createdAt: string;
  translations: {
    [key: string]: QuoteTranslation; // 'en', 'hi', etc.
  };
}

export interface QuotesResponse {
  statusCode: number;
  data: {
    quotes: Quote[];
    page: number;
    limit: number;
    totalCount: number;
  };
  message: string;
  success: boolean;
}

export default function AllQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const router = useRouter();

  // Fetch quotes
  const fetchQuotes = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`${API_URL}/quotes/Allquotes`, {
        params: { page: pageNum, limit },
      });

      if (response.data.success) {
        setQuotes(response.data.data.quotes || []);
        const total = response.data.data.totalCount;
        setTotalPages(Math.ceil(total / limit));
        setPage(pageNum);
      } else {
        toast.error("Failed to fetch quotes");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  };

  // Toggle quote enabled status
  const toggleQuoteStatus = async (quote: Quote) => {
    try {
      const response = await api.patch(
        `${API_URL}/quotes/changeStatus`,
        { enabled: !quote.enabled, id: quote.id },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(
          `Quote ${quote.enabled ? "disabled" : "enabled"} successfully`
        );
        fetchQuotes(page);
      } else {
        toast.error("Failed to update quote status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update quote status");
    }
  };

  // Delete quote
  const handleDeleteQuote = async () => {
    if (!currentQuote) return;

    try {
      const response = await api.delete(
        `${API_URL}/quotes/delete/${currentQuote.id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Quote deleted successfully");
        setIsDeleteModalOpen(false);
        setCurrentQuote(null);
        fetchQuotes(page);
      } else {
        toast.error("Failed to delete quote");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete quote");
    }
  };

  // Search quotes
  const filteredQuotes = quotes.filter((quote) => {
    const searchLower = searchTerm.toLowerCase();
    const englishText = quote.translations.en?.text?.toLowerCase() || "";
    const englishAuthor = quote.translations.en?.author?.toLowerCase() || "";

    return (
      englishText.includes(searchLower) ||
      englishAuthor.includes(searchLower) ||
      quote.id.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="md" color="purple" text="Loading quotes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>All Quotes | Dashboard</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Quotes</h1>
              <p className="text-gray-600 mt-2">
                Manage and organize your quotes
              </p>
            </div>
            <Link
              href="/admin/dashboard/quotes/create"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Quote
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotes by text or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Quote Header */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      ID: {quote.id.slice(0, 8)}...
                    </span>
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quote.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {quote.enabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote Content */}
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    English Translation:
                  </h3>
                  <p className="text-gray-800 italic mb-2 line-clamp-3">
                    {quote.translations.en?.text || "No English translation"}
                  </p>
                  <p className="text-sm text-gray-600">
                    — {quote.translations.en?.author || "Unknown"}
                  </p>
                  {quote.translations.en?.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Date:{" "}
                      {new Date(
                        quote.translations.en.date
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Available Languages */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <MdLanguage className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Available Languages:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(quote.translations).map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-gray-50 border-t flex justify-between">
                <button
                  onClick={() => toggleQuoteStatus(quote)}
                  className={`flex items-center text-sm ${
                    quote.enabled
                      ? "text-yellow-600 hover:text-yellow-800"
                      : "text-green-600 hover:text-green-800"
                  }`}
                >
                  {quote.enabled ? (
                    <>
                      <MdVisibilityOff className="mr-1" />
                      Disable
                    </>
                  ) : (
                    <>
                      <MdVisibility className="mr-1" />
                      Enable
                    </>
                  )}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      router.push(`/admin/dashboard/quotes/edit/${quote.id}`)
                    }
                    className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                  >
                    <MdEditNote className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQuote(quote);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900 flex items-center text-sm"
                  >
                    <MdDeleteOutline className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No quotes found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Get started by creating your first quote"}
            </p>
            <Link
              href="/admin/dashboard/quotes/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FaPlus className="mr-2" />
              Create Quote
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => page > 1 && fetchQuotes(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchQuotes(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    page === i + 1
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => page < totalPages && fetchQuotes(page + 1)}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/3">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this quote? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setCurrentQuote(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteQuote}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
