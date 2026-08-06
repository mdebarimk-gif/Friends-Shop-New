'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* Top Navbar for Large Screens & Desktop */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
            Friends<span className="text-gray-900">Shop</span>
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden max-w-md flex-1 px-8 sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Desktop Navigation Icons (Hidden on Mobile) */}
          <nav className="hidden items-center space-x-6 sm:flex">
            {/* Wishlist Icon */}
            <Link href="/wishlist" className="text-gray-600 hover:text-indigo-600 transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                0
              </span>
            </Link>
            {/* Profile Icon */}
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      {/* Bottom Navigation Bar for Mobile Only */}
      <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white px-6 sm:hidden shadow-lg">
        <div className="mx-auto flex h-full max-w-md items-center justify-between">
          {/* Home */}
          <Link href="/" className="flex flex-col items-center justify-center text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium pt-0.5">Home</span>
          </Link>
          {/* Search */}
          <Link href="/search" className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] font-medium pt-0.5">Search</span>
          </Link>
          {/* Cart */}
          <Link href="/cart" className="relative flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
              0
            </span>
            <span className="text-[10px] font-medium pt-0.5">Cart</span>
          </Link>
          {/* Wishlist */}
          <Link href="/wishlist" className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[10px] font-medium pt-0.5">Wishlist</span>
          </Link>
          {/* Profile */}
          <Link href="/login" className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium pt-0.5">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
}