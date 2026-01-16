/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { MdAdd, MdDelete, MdLanguage } from "react-icons/md";
import toast from "react-hot-toast";
import api from "@/lib/axios";

interface Translation {
  text: string;
  author: string;
  date: string;
}

export default function CreateQuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [enabled, setEnabled] = useState(true);

  // English is default and required
  const [translations, setTranslations] = useState<Record<string, Translation>>(
    {
      en: { text: "", author: "", date: "" },
    }
  );

  const [newLanguage, setNewLanguage] = useState("");

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new language translation
  const addLanguage = () => {
    if (newLanguage && !translations[newLanguage]) {
      setTranslations({
        ...translations,
        [newLanguage]: { text: "", author: "", date: "" },
      });
      setNewLanguage("");
    }
  };

  // Remove language translation
  const removeLanguage = (lang: string) => {
    if (lang !== "en") {
      // Don't remove English
      const newTranslations = { ...translations };
      delete newTranslations[lang];
      setTranslations(newTranslations);
    }
  };

  // Update translation
  const updateTranslation = (
    lang: string,
    field: keyof Translation,
    value: string
  ) => {
    setTranslations({
      ...translations,
      [lang]: {
        ...translations[lang],
        [field]: value,
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Add translations
      formData.append("translations", JSON.stringify(translations));
      formData.append("enabled", enabled.toString());

      // Add image if exists
      if (imageFile) {
        formData.append("quoteimage", imageFile);
      }

      const response = await api.post(`${API_URL}/quotes/create`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Quote created successfully!");
        router.push("/admin/dashboard/quotes");
      } else {
        toast.error(response.data.message || "Failed to create quote");
      }
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(error.response?.data?.message || "Failed to create quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create Quote | Dashboard</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Quote
              </h1>
              <p className="text-gray-600 mt-2">
                Add a new inspirational quote with translations
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Choose Image
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Upload an image related to the quote
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable this quote
              </span>
            </label>
          </div>

          {/* Translations */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Translations
              </h2>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value.toLowerCase())}
                  placeholder="Add language code (e.g., hi, fr)"
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                  maxLength={2}
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                >
                  <MdAdd className="mr-1" />
                  Add
                </button>
              </div>
            </div>

            {Object.entries(translations).map(([lang, translation]) => (
              <div
                key={lang}
                className="mb-6 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <MdLanguage className="text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">
                      {lang.toUpperCase()} {lang === "en" && "(Default)"}
                    </span>
                  </div>
                  {lang !== "en" && (
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quote Text *
                    </label>
                    <textarea
                      value={translation.text}
                      onChange={(e) =>
                        updateTranslation(lang, "text", e.target.value)
                      }
                      required={lang === "en"}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter the quote text..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author *
                      </label>
                      <input
                        type="text"
                        value={translation.author}
                        onChange={(e) =>
                          updateTranslation(lang, "author", e.target.value)
                        }
                        required={lang === "en"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={translation.date}
                        onChange={(e) =>
                          updateTranslation(lang, "date", e.target.value)
                        }
                        required={lang === "en"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !translations.en.text ||
                !translations.en.author ||
                !translations.en.date
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
