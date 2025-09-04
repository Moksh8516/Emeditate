"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
}

export default function AddVideoForm() {
  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/video`, formData, {
        withCredentials: true,
      });
      //   console.log("Video added:", res.data);

      toast.success("✅ Video Ingestion successfully!");
      setFormData({ title: "", description: "", videoUrl: "" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error adding video:", err);
      toast.error(err.response?.data?.message || "❌ Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 items-center justify-center px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Add New Video</h1>
          <p className="mt-2 text-gray-600">
            Provide the details to add a new video
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter video title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter video description"
            />
          </div>

          {/* Video URL */}
          <div>
            <label
              htmlFor="videoUrl"
              className="block text-sm font-medium text-gray-700"
            >
              YouTube Video URL
            </label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              required
              value={formData.videoUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://www.youtube.com/watch?v=XXXXXX"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-indigo-400"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {loading ? "⏳ Adding..." : "🚀 Add Video"}
            </button>
          </div>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Go back to Dashboard?{" "}
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
