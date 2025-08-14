"use client";
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FaFileAlt, FaUpload, FaUserPlus, FaSignOutAlt, FaUsers, FaUserCircle, FaCog } from 'react-icons/fa';
import {useRouter} from 'next/navigation';
import { FiChevronDown } from 'react-icons/fi';
function DashboardPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Mock admin data - replace with real data from your API
  const admins = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Super Admin' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'Content Manager' },
    { id: 3, name: 'John Smith', email: 'john@example.com', role: 'Support Admin' },
  ];

  const handleSignOut = () => {
    router.push('/login');
  };

    // Mock current user
  const currentUser = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    initial: 'A'
  };
    // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
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
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/admin/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserCircle className="mr-3 text-gray-500" />
                        My Profile
                      </Link>
                      <Link
                        href="/admin/change-password"
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
                <p className="opacity-80 mt-1">Browse and manage all documents</p>
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
                <p className="opacity-80 mt-1">Add new documents to the system</p>
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
                <p className="opacity-80 mt-1">Create new administrator accounts</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.email}</td>
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