'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/10 md:shadow-lg backdop-blur-md px-4 py-3 rounded-xl relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link className="flex items-center gap-3 outline-none" href={"/"}>
          <Image
            src="/heroImage.jpg"
            width={40}
            height={40}
            alt="Logo"
            className="rounded-full w-10 h-auto "
          />
          <h1 className="font-bold text-white text-2xl">SAHAJA YOGA AI</h1>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 text-white font-medium text-lg z-10">
          <Link href="/about" className='decoration-none no-underline'>
          <span className="hover:text-gray-300 cursor-pointer">
            About
            </span>
            </Link>
           <Link href="/blog" className='decoration-none no-underline'>
           <span className="hover:text-gray-300 cursor-pointer">
            Blog
            </span>
            </Link>
          <Link href="/contact-us" className='decoration-none no-underline'>
           <span className="hover:text-gray-300 cursor-pointer">
            Contact us
            </span>
            </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-10">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />  
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-3 px-2 py-2 absolute left-0 top-10 w-full text-white bg-white/10 shadow-lg rounded-b-xl text-lg backdrop-blur-md">
            <Link href="/about" className='decoration-none no-underline'>
          <span className="hover:text-gray-300 cursor-pointer">
            About
            </span>
            </Link>
           <Link href="/blog" className='decoration-none no-underline'>
           <span className="hover:text-gray-300 cursor-pointer">
            Blog
            </span>
            </Link>
           <Link href="/contact-us" className='decoration-none no-underline'>
           <span className="hover:text-gray-300 cursor-pointer">
            Contact us
            </span>
            </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
