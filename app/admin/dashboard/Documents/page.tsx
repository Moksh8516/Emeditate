"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import {
  FiFile,
  FiFolder,
  FiClock,
  FiDownload,
  FiMoreVertical,
} from "react-icons/fi";
import { FaFilePdf, FaFileAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import Pagination from "@/components/Pagination";
interface Document {
  id: string;
  fileName: string;
  storagePath: string;
  uploadedAt: string;
  fileType?: string;
}

function DocumentListPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        const res = await axios.post(
          `${API_URL}/get-files?page=${currentPage}`,
          {},
          { withCredentials: true }
        );
        setDocuments(res.data.data.documents);
        setCurrentPage(res.data.data.Pagination.currentPage || 1);
        setTotalPages(res.data.data.Pagination.totalPages || 1);
        setTotalFiles(res.data.data.Pagination.totalCount);
      } catch (err) {
        setError("Failed to load documents. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [currentPage]);

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaFilePdf className="text-red-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    // console.log("dateString", dateString);
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center`}
      >
        <Loader size="md" color="purple" text={"Loading Your documents"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <FiFile className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              Error Loading Documents
            </h3>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Document Library
              </h1>
              <p className="mt-2 text-purple-100 max-w-2xl">
                Manage your AI training files and datasets
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white font-medium">
                  {totalFiles} {totalFiles === 1 ? "File" : "Files"}
                </p>
              </div>
              <button
                onClick={() => router.push("/admin/dashboard/upload")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
              >
                <FiFolder className="mr-2 -ml-1 h-5 w-5" />
                New Upload
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-purple-100">
              <FiFile className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              No documents found
            </h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Get started by uploading your first file to the AI training
              library.
            </p>
            <div className="mt-8">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Upload Files
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex align-middle justify-between items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-3">
                      <div className="text-xl">{getFileIcon(doc.fileName)}</div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 break-words">
                        {doc.fileName}
                      </h3>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FiMoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-end">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      {formatDate(doc.uploadedAt)}
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Link
                      href={doc.storagePath}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm"
                    >
                      <FiDownload className="mr-2 h-4 w-4" />
                      Download
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        mode="light"
      />
    </div>
  );
}

export default DocumentListPage;
