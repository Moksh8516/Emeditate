"use client";
// pages/index.tsx
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Loader } from "@/components/loader";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import { CreatePostModal } from "@/components/blogsModals/CreateModal";
import { FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { useAuthStore } from "@/store/useAuthModel";
import EditPostModal from "@/components/blogsModals/EditModal";

export interface BlogPost {
  id: number;
  Title: string;
  subTitle: string;
  description: string;
  content: string;
  author?: string;
  createdAt: string;
  category?: string;
  status?: "published" | "draft";
  image?: string | null;
  imagePreview?: string;
}

interface CurrentUser {
  name: string;
  email: string;
  initial: string;
}

export default function BlogDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "",
    email: "",
    initial: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getProfile = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/profile`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setCurrentUser({
          name: res.data.data.name,
          email: res.data.data.email,
          initial: res.data.data.name.charAt(0).toUpperCase(),
        });

        useAuthStore.getState().setCurrentUser({
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role,
          initial: res.data.data.name.charAt(0).toUpperCase(),
          dob: res.data.data?.dob,
          profileImage: res.data.data?.profileImage,
          age: res.data.data?.age,
        });
      } else {
        throw new Error(res.data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Authentication failed. Redirecting to login...");
      router.push("/admin/login");
    }
  };

  const handleSignOut = async () => {
    const res = await axios.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    if (res.data.success) {
      toast.success("Logged out successfully!");
      useAuthStore.getState().clearUser();
      router.push("/admin/login");
    } else {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blog`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setPosts(data.data.blogs || []);
        setError(null);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (err) {
      setError("Failed to fetch posts");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (currentPost: BlogPost) => {
    if (!currentPost) return;

    const newStatus =
      currentPost.status === "published" ? "draft" : "published";

    try {
      const response = await axios.patch(
        `${API_URL}/blog/changeStatus/${currentPost.id}`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Refetch to ensure data consistency
        fetchPosts();
        setCurrentPost(null);
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError("Failed to update status");
      console.error("Status update error:", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
    getProfile();
  }, []);

  // Handle post creation
  const handlePostCreated = () => {
    // Refetch all posts to ensure consistency
    fetchPosts();
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!currentPost) return;

    try {
      const response = await axios.delete(
        `${API_URL}/blog/delete/${currentPost.id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Refetch to ensure data consistency
        fetchPosts();
        setIsDeleteModalOpen(false);
        setCurrentPost(null);
      } else {
        setError("Failed to delete post");
      }
    } catch (err) {
      setError("Failed to delete post");
      console.error("Delete error:", err);
    }
  };

  const openEditModal = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (post: BlogPost) => {
    setCurrentPost(post);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader size="md" color="purple" text={"Loading Blogs... "} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Blog Dashboard</title>
        <meta name="description" content="Blog management dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top Navigation Bar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Blog Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              {/* User Profile Dropdown */}
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none hover:bg-gray-100 px-3 py-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {currentUser.initial}
                  </div>
                  <span className="ml-2 text-gray-700 font-medium hidden md:inline">
                    {currentUser.name}
                  </span>
                  <FiChevronDown className="ml-1 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-3 px-4 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/admin/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserCircle className="mr-3 text-gray-500" />
                        My Profile
                      </Link>
                      <Link
                        href="/admin/dashboard/change-password"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaCog className="mr-3 text-gray-500" />
                        Change Password
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-3 text-gray-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Total Posts
                </h2>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Published
                </h2>
                <p className="text-2xl font-bold">
                  {posts.filter((post) => post.status === "published").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Drafts</h2>
                <p className="text-2xl font-bold">
                  {posts.filter((post) => post.status === "draft").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            New Post
          </button>
        </div>

        {/* Blog Posts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Posts
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {post.Title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {post.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            handleChangeStatus(
                              currentPost ? currentPost : post
                            );
                          }}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all hover:opacity-80 ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                        >
                          {post.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 flex gap-2 align-middle justify-center font-medium">
                        <button
                          onClick={() => openEditModal(post)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <MdEditNote size={25} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(post)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <MdDeleteOutline size={25} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {isEditModalOpen && currentPost && (
        <EditPostModal
          currentPost={currentPost}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={fetchPosts} // refetch after update
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/3 max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the post {currentPost.Title} ?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
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
