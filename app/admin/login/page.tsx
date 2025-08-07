/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MyBackground from '@/components/MyBackground';
import { API_URL } from '@/lib/config';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        if(password.length < 8) {
           return setErrors({ password: 'Password must be at least 8 characters long.' });  
        }
        
        try {
            const formData = { email, password, role: "admin" as const };
            const res = await axios.post(`${API_URL}/login`, 
              formData,{withCredentials: true}// Important: This allows cookies to be set}
            );
            
            if (res.data.success) {
                // Get the callback URL from the query parameters
                const searchParams = new URLSearchParams(window.location.search);
                const callbackUrl = searchParams.get('callbackUrl');
                // Redirect to the callback URL if it exists, otherwise go to dashboard
                router.push(callbackUrl || '/admin/dashboard/upload');
            } else {
                setErrors({ 
                    form: res.data.message || 'Login failed. Please try again.' 
                });
            }        
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
          console.error('Login failed:', errorMessage);
            setErrors({ form:  errorMessage[0].message || errorMessage });
        }
    }

  return (
    <MyBackground>
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white text-center">
            <h1 className="text-3xl font-bold mb-1">LogIn</h1>
            <p className="opacity-90">Sign in to access your account</p>
          </div>
          
          <div className="p-8">
            {errors.form && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600">
                {errors.form}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    onChange={(e)=>setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    id="password" 
                    onChange={(e)=>setPassword(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="••••••••"
                    required
                  />
                  {errors && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
              </div>
              
              {/* <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div> */}
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition duration-300 shadow-lg"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {"Don't have an account?  "}
                <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
 </MyBackground>
  );
}