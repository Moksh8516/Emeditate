"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  FaFileAlt,
  FaUpload,
  FaUserPlus,
  FaSignOutAlt,
  FaUsers,
  FaUserCircle,
  FaCogs,
} from "react-icons/fa";
import { BiBookContent } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import axios from "axios";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthModel";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { IoMdMusicalNote } from "react-icons/io";
interface CurrentUser {
  name: string;
  email: string;
  initial: string;
}
interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: string;
}

function DashboardPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "",
    email: "",
    initial: "",
  });
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const authuser = async () => {
    try {
      const res = await axios.get(`${API_URL}/all-auth-user`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setAdmins(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
      toast.error("Failed to load admin users");
    }
  };

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

  useEffect(() => {
    getProfile();
    authuser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">
                  Admin Dashboard
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
                        <FaCogs className="mr-3 text-gray-500" />
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
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/dashboard/Documents"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <FaFileAlt className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">View Documents</h2>
                <p className="opacity-80 mt-1">
                  Browse and manage all documents
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/upload"
            className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <FaUpload className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">Upload File</h2>
                <p className="opacity-80 mt-1">
                  Add new documents to the system
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/create-user"
            className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <FaUserPlus className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">Register New Admin</h2>
                <p className="opacity-80 mt-1">
                  Create new administrator accounts
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/blog"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <BiBookContent className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">Register New Blog</h2>
                <p className="opacity-80 mt-1">Add new Blogs for Site</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/videos"
            className="bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <MdOutlineVideoLibrary className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">Register New videos</h2>
                <p className="opacity-80 mt-1">Add new videos</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/lyrics"
            className="bg-gradient-to-r from-red-500 to-yellow-300  rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <IoMdMusicalNote className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">Register New Lyrics</h2>
                <p className="opacity-80 mt-1">Add new videos</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Admin List Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <FaUsers className="mr-2 text-indigo-600" />
                Admin Users
              </h2>
              <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {admins.length} Admins
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin, index) => (
                  <tr key={admin.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {admin.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
