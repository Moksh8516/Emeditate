import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/config';
import { BlogPost } from '@/app/admin/dashboard/blog/page'; // Adjust the import path as needed

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: BlogPost) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onPostCreated 
}) => {
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    Title: '',
    subTitle: '',
    description: '',
    content: '',
    author: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImageFile(file);

    // preview
    const previewUrl = URL.createObjectURL(file);
    setNewPost((prev) => ({ ...prev, image: previewUrl }));
  }
};

  const handleCreatePost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate required fields
      if (!newPost.Title || !newPost.subTitle || !newPost.content || !newPost.description || !newPost.subTitle || !imageFile) {
        setError('Please fill in all required fields');
        return;
      }

       const formData = new FormData();
    formData.append("Title", newPost.Title);
    formData.append("subTitle", newPost.subTitle);
    formData.append("description", newPost.description);
    formData.append("content", newPost.content);
    formData.append("author", newPost.author || "");
    formData.append("category", newPost.category || "");
    if (imageFile) {
      formData.append("Image", imageFile); // 👈 send actual file
    }

      const response = await axios.post(`${API_URL}/blog/create`, formData, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        onPostCreated(response.data);
        setNewPost({
          Title: '',
          subTitle: '',
          description: '',
          content: '',
          author: '',
          category: '',
        });
        setImageFile(null);
        onClose();
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Create New Post</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Title Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Title *</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                value={newPost.Title || ''}
                onChange={(e) => setNewPost({...newPost, Title: e.target.value})}
                placeholder="Enter post title"
                disabled={isLoading}
              />
            </div>

            {/* Subtitle Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Subtitle *</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                value={newPost.subTitle || ''}
                onChange={(e) => setNewPost({...newPost, subTitle: e.target.value})}
                placeholder="Enter post subtitle"
                disabled={isLoading}
              />
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description *</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                rows={3}
                value={newPost.description || ''}
                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                placeholder="Brief description of your post..."
                disabled={isLoading}
              ></textarea>
            </div>

            {/* Content Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Content *</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                rows={5}
                value={newPost.content || ''}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Write your post content..."
                disabled={isLoading}
              ></textarea>
            </div>

            {/* Author and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Author</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                  value={newPost.author || ''}
                  onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                  placeholder="Author name"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                  value={newPost.category || ''}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  placeholder="Post category"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Featured Image *</label>
              <div className="mt-1 flex justify-center px-6 pt-6 pb-8 border-2 border-dashed border-gray-300 rounded-xl transition-colors hover:border-indigo-400 bg-gray-50">
                <div className="space-y-4 text-center">
                  {newPost.image ? (
                    <div className="relative inline-block">
                      <div className="relative">
                        <img 
                          src={newPost.image} 
                          alt="Preview" 
                          className="mx-auto h-32 w-32 object-cover rounded-xl shadow-md border-2 border-white"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setNewPost({...newPost, image: ''})}
                            className="text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition"
                            disabled={isLoading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 truncate max-w-xs"></p>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                        <svg className="h-8 w-8 text-indigo-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center items-center gap-2">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">Select a file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isLoading}
                          />
                        </label>
                        <p className="text-gray-500">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md font-medium flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};