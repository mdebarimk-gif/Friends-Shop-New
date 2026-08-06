import React from 'react';
import "./globals.css";


export const metadata = {
  title: 'Friends Shop | Premium E-commerce Store',
  description: 'Built natively on mobile.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen m-0 p-0 flex flex-col antialiased" style={{ fontFamily: 'sans-serif' }}>
        
        {/* ==================== DARAZ STYLE TOP SEARCH BAR (FIXED) ==================== */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          backgroundColor: '#ff4600', // দারাজ থিম সিগনেচার অরেঞ্জ-রেড ব্যাকগ্রাউন্ড
          padding: '8px 12px',
          boxSizing: 'border-box',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '56px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', width: '100%', itemsCenter: 'center', gap: '8px' }}>
            {/* Search Input Container */}
            <div style={{
              display: 'flex',
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '2px 4px 2px 12px',
              alignItems: 'center',
              height: '36px',
              boxSizing: 'border-box'
            }}>
              <input
                type="text"
                placeholder="Search in Friends Shop..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#212121',
                  backgroundColor: 'transparent'
                }}
              />
              {/* Search Button inside Input */}
              <button style={{
                backgroundColor: '#ff4600',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Search
              </button>
            </div>
          </div>
        </header>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="flex-1 mx-auto w-full mb-20" style={{ boxSizing: 'border-box' }}>
          {children}
        </main>

        {/* ==================== APP-STYLE BOTTOM NAVBAR ==================== */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 50,
          height: '56px',
          width: '100%',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'around'
        }}>
          
          {/* For You Tab */}
          <a href="/" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#ff4600' }}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '2px' }}>For You</span>
          </a>

          {/* Categories Tab */}
          <a href="/search" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#757575' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: '500', marginTop: '2px' }}>Categories</span>
          </a>

          {/* Cart Tab */}
          <a href="/cart" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#757575', position: 'relative' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '22px',
              backgroundColor: '#ff4600',
              color: '#ffffff',
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              fontSize: '8px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>0</span>
            <span style={{ fontSize: '10px', fontWeight: '500', marginTop: '2px' }}>Cart</span>
          </a>

          {/* Account Tab */}
          <a href="/login" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#757575' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: '500', marginTop: '2px' }}>Account</span>
          </a>

        </div>

      </body>
    </html>
  );
}
