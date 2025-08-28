"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import MyBackground from '@/components/MyBackground';
import { Loader } from '@/components/loader';
import { API_URL } from '@/lib/config';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthModel';

interface PasswordChangeFormData {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

function ChangePassword() { // Changed to PascalCase
  const router = useRouter();
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const CurrentUser = useAuthStore((state) => state.currentUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.oldPassword || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      // Send password change request to backend
      await axios.post(`${API_URL}/change-password`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.password,
      }, {
        withCredentials: true,
      });
      toast.success('Password changed successfully!');
      // Redirect to dashboard after successful password change
      if (CurrentUser?.role === 'admin') {
      router.push('/admin/dashboard');
      }else if (CurrentUser?.role === 'content Manager') {
        router.push('/admin/dashboard/blog');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Password change failed. Please try again.'
      );
      toast.error('Password change failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MyBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Change Password
            </h1>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                required
                value={formData.oldPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700"> {/* Fixed: Changed id to "password" */}
                New Password
              </label>
              <input
                id="password" 
                name="password" 
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <Loader size="md" color="purple" text={"Changing Password... "}/>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MyBackground>
  );
}

export default ChangePassword; 