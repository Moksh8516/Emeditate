"use client";
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import React from 'react';

function DashboardPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {/* Your dashboard content */}
      <div className='flex flex-col align-center '>
      <Link href={"/admin/dashboard/create-user"} className='bg-green-300 text-lg text-center py-2 px-4 rounded-lg hover:bg-green-400'>Register New Admin</Link>
      </ div>
    </div>
  );
}

export default DashboardPage;