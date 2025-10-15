"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";
import { BlogPost } from "@/app/admin/dashboard/blog/page";
import {
  FiX,
  FiImage,
  FiType,
  FiFileText,
  FiUser,
  FiTag,
  FiSave,
} from "react-icons/fi";
import api from "@/lib/axios";

interface EditPostModalProps {
  currentPost: BlogPost;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export default function EditPostModal({
  currentPost,
  onClose,
  onUpdateSuccess,
}: EditPostModalProps) {
  const [formData, setFormData] = useState<BlogPost>(currentPost);
  const [preview, setPreview] = useState<string | null>(
    currentPost?.image || null
  );
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(currentPost);
    setPreview(currentPost?.image || null);
  }, [currentPost]);

  // Handle image preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  // Handle update
  const handleUpdatePost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("Title", formData.Title);
      form.append("subTitle", formData.subTitle);
      form.append("description", formData.description);
      form.append("content", formData.content);
      if (formData.author) form.append("author", formData.author);
      if (formData.category) form.append("category", formData.category);

      if (file) {
        form.append("Image", file); // file upload
      }

      const response = await api.put(
        `${API_URL}/blog/update/${currentPost.id}`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        onUpdateSuccess(); // refetch posts
        onClose();
      } else {
        setError("Failed to update post");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden transform transition-all scale-100 opacity-100 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Blog Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiType className="mr-2" />
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={formData.Title}
                  onChange={(e) =>
                    setFormData({ ...formData, Title: e.target.value })
                  }
                  placeholder="Enter post title"
                />
              </div>

              {/* Sub Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiType className="mr-2" />
                  Sub Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={formData.subTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subTitle: e.target.value })
                  }
                  placeholder="Enter sub title"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiFileText className="mr-2" />
                  Content
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  rows={8}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your content here..."
                ></textarea>
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiUser className="mr-2" />
                    Author
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiTag className="mr-2" />
                    Category
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="Category"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Content and Image */}
            <div className="space-y-5">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiFileText className="mr-2" />
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter a short description"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiImage className="mr-2" />
                  Featured Image
                </label>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition hover:border-indigo-400">
                  {preview ? (
                    <div className="relative w-full">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <button
                        onClick={() => {
                          setPreview(null);
                          setFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FiX size={12} />
                      </button>
                      <div className="text-center">
                        <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm justify-center text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                            <span>Upload an image</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload an image</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePost}
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg font-medium disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <FiSave className="mr-2 animate-pulse" />
                  Updating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Update Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
