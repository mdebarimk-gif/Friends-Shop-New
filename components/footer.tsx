import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6 mb-16 sm:mb-0">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs text-gray-500 sm:text-sm">
          &copy; {new Date().getFullYear()} Friends Shop. All rights reserved. Built with pride on Android.
        </p>
      </div>
    </footer>
  );
}