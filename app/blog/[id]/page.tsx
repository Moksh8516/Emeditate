// app/blog/[uid]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import MyBackground from '@/components/MyBackground';
import { Loader } from '@/components/loader';
import { API_URL } from '@/lib/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
interface Blog {
  id: string;
  Title: string;
  subTitle: string;
  content?: string;
  description: string;
  author?: string;
  createdAt: string;
  image: string;
}

function ViewBlog() {
  const params = useParams();
  const uid = params.id as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/blog/${uid}`);
        setBlog(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blog. Please try again later.');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchBlog();
    }
  }, [uid]);
  console.log(blog);

  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MyBackground>
        <div className="min-h-screen flex items-center justify-center">
          <Loader size="lg" color="white" text="Loading blog post..." className='text-gray-200' />
        </div>
      </MyBackground>
    );
  }

  if (error || !blog) {
    return (
      <MyBackground>
        <div className="min-h-screen flex items-center justify-center md:px-4">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
            <h1 className="text-2xl font-bold text-gray-800">Blog Not Found</h1>
            <p className="text-gray-600">{error || "The blog post you're looking for doesn't exist."}</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:from-purple-600 hover:to-indigo-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </MyBackground>
    );
  }

  return (
    <MyBackground>
        <Navbar/>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
     {/* Blog Header Image */}
{/* Blog Header Image */}
<div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl shadow-md">
  <img 
    src={blog.image} 
    alt={blog.Title}
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>

          
          {/* Blog Content */}
          <div className="p-8">
            {/* Tags
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )} */}
            
            {/* Title and Subtitle */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.Title}</h1>
            <h2 className="text-xl text-indigo-600 font-semibold mb-6">{blog.subTitle}</h2>
            
            {/* Meta Information */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <span className="text-gray-700 font-medium">{blog.author}</span>
              </div>
              <span className="text-gray-500">{formatDate(blog.createdAt)}</span>
            </div>
            
            {/* Description */}
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{blog.description}</p>
            
            {/* Main Content */}
            <div className="prose max-w-none text-gray-600">
              {blog?.content?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6">{paragraph}</p>
              ))}
            </div>
            
            {/* Back Button */}
            <div className="mt-12 pt-6 border-t text-center border-gray-200">
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:from-purple-600 hover:to-indigo-600 transition-colors"
              >
                Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </MyBackground>
  );
}

export default ViewBlog;