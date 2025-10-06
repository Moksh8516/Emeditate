"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
}

interface Video {
  id: string;
  title: string;
  uploadAt: string;
}

interface VideoListResponse {
  data: {
    videos: Video[];
    currentPage: number;
    totalPages: number;
  };
}

export default function AddVideoForm() {
  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    videoUrl: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.post(`${API_URL}/video`, formData, {
        withCredentials: true,
      });
      toast.success("✅ Video added successfully!");
      setFormData({ title: "", description: "", videoUrl: "" });
      // Refresh the video list after adding a new video
      setCurrentPage(1);
      getYouTubeVideoList(1, true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error adding video:", err);
      toast.error(err.response?.data?.message || "❌ Failed to add video");
    } finally {
      setFormLoading(false);
    }
  };

  const getYouTubeVideoList = useCallback(
    async (page: number, reset: boolean = false) => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const res = await axios.get<VideoListResponse>(
          `${API_URL}/video-list?page=${page}&limit=8`,
          {
            withCredentials: true,
          }
        );

        if (reset) {
          setVideoList(res.data.data.videos);
        } else {
          setVideoList((prev) => [...prev, ...res.data.data.videos]);
        }

        setCurrentPage(res.data.data.currentPage);
        setTotalPages(res.data.data.totalPages);
        setHasMore(res.data.data.currentPage < res.data.data.totalPages);
      } catch (err) {
        console.error("Error fetching videos:", err);
        toast.error("❌ Failed to get video list");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    if (observer.current) observer.current.disconnect();

    const options = {
      root: scrollContainerRef.current,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        getYouTubeVideoList(currentPage + 1);
      }
    }, options);

    if (lastVideoElementRef.current) {
      observer.current.observe(lastVideoElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [videoList, loadingMore, currentPage, hasMore, getYouTubeVideoList]);

  useEffect(() => {
    getYouTubeVideoList(1, true);
  }, [getYouTubeVideoList]);

  // Format date to a cleaner format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold pb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Video Manager
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Add and manage your video content with our intuitive platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Video Form */}
          <div className="w-full p-8 space-y-7 bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Video
              </h2>
              <p className="mt-2 text-gray-500">
                Fill in the details to add a new video
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter video description (maximum 200 words)"
                />
              </div>

              <div>
                <label
                  htmlFor="videoUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="https://www.youtube.com/watch?v=XXXXXX"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 ${
                    formLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg"
                  }`}
                >
                  {formLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader color="white" />
                      Adding Video...
                    </div>
                  ) : (
                    "Add Video"
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Video List */}
          <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-7">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Videos
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your uploaded video content
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium py-1.5 px-3 rounded-full">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Scrollable container with fixed height */}
            <div
              ref={scrollContainerRef}
              className="h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 scrollbar-thumb-rounded-full"
            >
              {loading && videoList.length === 0 ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 border border-gray-100 rounded-xl animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : videoList.length === 0 ? (
                <div className="text-center py-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-700">
                    No videos yet
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Get started by adding your first video
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {videoList.map((video, index) => {
                    if (videoList.length === index + 1) {
                      return (
                        <div
                          key={video.id}
                          ref={lastVideoElementRef}
                          className="flex justify-between items-center p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          <div className="font-medium text-gray-800 truncate max-w-xs">
                            {video.title}
                          </div>
                          <div className="text-sm text-gray-500 whitespace-nowrap bg-white py-1 px-2.5 rounded-lg border border-gray-200">
                            {formatDate(video.uploadAt)}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={video.id}
                          className="flex justify-between items-center p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          <div className="font-medium text-gray-800 truncate max-w-xs">
                            {video.title}
                          </div>
                          <div className="text-sm text-gray-500 whitespace-nowrap bg-white py-1 px-2.5 rounded-lg border border-gray-200">
                            {formatDate(video.uploadAt)}
                          </div>
                        </div>
                      );
                    }
                  })}

                  {loadingMore && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  {!hasMore && videoList.length > 0 && (
                    <div className="text-center py-5 text-sm text-gray-500 bg-blue-50 rounded-xl border border-blue-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-1 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {"You've reached the end of your video list"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
