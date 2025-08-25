"use client"
import MyBackground from '@/components/MyBackground';
import { Loader } from '@/components/loader';
import Pagination from '@/components/Pagination';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/config';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
interface Blog {
  id: string;
  Title: string;
  subTitle: string;
  description: string;
  createdAt: string;
  image: string;
}

function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const blogsPerPage = 6;

   useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get(`${API_URL}/blog/publish/blogs?page=${currentPage}&limit=${blogsPerPage}`);
             // Check the actual structure of your API response
        if (response.data.success) {
          setBlogs(response.data.data.blogs || []);
          setCurrentPage(response.data.data.currentPage || currentPage);
          setTotalPages(response.data.data.totalPages || 1);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
        fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size='md' color='white' text={"Loading Blogs ..."}/>
      </div>
    );
  }

  if (error) {
    return (
      <MyBackground>
        <div className="text-center text-white py-12">
          <h1 className="text-3xl font-bold mb-4">Oops!</h1>
          <p>{error}</p>
        </div>
      </MyBackground>
    );
  }
  return (
    <MyBackground>
      <Navbar></Navbar>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-12">
           <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-purple-100 text-xl max-w-2xl mx-auto">
            {"Discover the wisdom of Sahaja Yoga – insights, experiences, and guidance for inner peace and spiritual growth."}
          </p>
        </motion.div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300">
              <img 
                src={blog.image || '/default-blog-image.jpg'} 
                alt={blog.Title} 
                className="w-full h-52 object-contain"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-2">{blog.Title}</h2>
                <h3 className="text-lg font-medium text-gray-300 mb-4">{blog.subTitle}</h3>
                <p className="text-gray-200 mb-4">{blog.description.length > 100 ? blog.description.slice(0, 100) + '...' : blog.description}</p>
                <p className="text-sm text-end text-gray-400">Published on {new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 text-center bg-gray-800/20">
                <Link
                  href={`/blog/${blog.id}`} 
                  className="text-gray-200 hover:underline"
                >
                  Read More
                </Link>
            </div>  
            </div>  
          ))}
        </div>
               <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(handlePageChange)}/>
      </div>
      <Footer/>
    </MyBackground>
  )
}

export default BlogPage;