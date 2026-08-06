'use client';

import React, { useState } from 'react';

// ডামি প্রোডাক্ট ডেটা (আমরা ধরে নিচ্ছি কাস্টমার হেডফোনে ক্লিক করেছে)
const productDetail = {
  id: 1,
  title: 'Premium Wireless Bluetooth Headphone - Active Noise Cancelling with Super Bass',
  image: '🎧',
  price: 1250,
  oldPrice: 2500,
  discount: '-50%',
  rating: '4.8 (124 Reviews)',
  stock: 'In Stock (Only 5 left)',
  tag: 'Free Gift 🎁',
  description: 'Experience pure sound quality with our premium wireless headphone. Equipped with advanced Active Noise Cancellation (ANC), deep bass drivers, and up to 40 hours of battery life. Perfect for gaming, music lovers, and office work. Comes with a free carrying pouch and 6 months warranty.',
  seller: 'Friends Electronic Store (Verified Seller)'
};

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px', 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh',
      paddingBottom: '80px', // নিচের ফিক্সড বাটনের জন্য অতিরিক্ত প্যাডিং
      boxSizing: 'border-box',
      width: '100%'
    }}>
      
      {/* ==================== PRODUCT IMAGE ==================== */}
      <div style={{
        backgroundColor: '#ffffff',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '120px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {productDetail.image}
      </div>

      {/* ==================== PRICE & TITLE INFO ==================== */}
      <div style={{ backgroundColor: '#ffffff', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4600' }}>৳{productDetail.price}</span>
          <span style={{ fontSize: '14px', color: '#9e9e9e', textDecoration: 'line-through' }}>৳{productDetail.oldPrice}</span>
          <span style={{ fontSize: '12px', color: '#ff4600', fontWeight: 'bold', backgroundColor: '#fff0e6', padding: '2px 6px', borderRadius: '4px' }}>{productDetail.discount} OFF</span>
        </div>

        <h1 style={{ fontSize: '15px', fontWeight: '600', color: '#212121', margin: 0, lineHeight: '1.4' }}>
          {productDetail.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#757575', borderTop: '1px solid #f5f5f5', paddingTop: '8px', marginTop: '4px' }}>
          <span>⭐ {productDetail.rating}</span>
          <span>•</span>
          <span style={{ color: '#2ec4b6', fontWeight: 'bold' }}>{productDetail.stock}</span>
        </div>
      </div>

      {/* ==================== QUANTITY SELECTOR ==================== */}
      <div style={{ backgroundColor: '#ffffff', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#212121' }}>Quantity</span>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
          <button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={{ border: 'none', backgroundColor: '#f5f5f5', padding: '6px 14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            -
          </button>
          <span style={{ padding: '0 16px', fontSize: '14px', fontWeight: 'bold', color: '#212121' }}>{quantity}</span>
          <button 
            onClick={() => setQuantity(q => q + 1)}
            style={{ border: 'none', backgroundColor: '#f5f5f5', padding: '6px 14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            +
          </button>
        </div>
      </div>

      {/* ==================== PRODUCT DESCRIPTION ==================== */}
      <div style={{ backgroundColor: '#ffffff', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#212121' }}>Product Specifications</h2>
        <p style={{ fontSize: '12px', color: '#424242', margin: 0, lineHeight: '1.6', textAlign: 'justify' }}>
          {productDetail.description}
        </p>
        <div style={{ fontSize: '11px', color: '#757575', marginTop: '6px', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '6px' }}>
          🏪 Store: {productDetail.seller}
        </div>
      </div>

      {/* ==================== FIXED BOTTOM ACTION BUTTONS (DARAZ STYLE) ==================== */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 100,
        height: '60px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0',
        padding: '8px 12px',
        boxSizing: 'border-box',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
      }}>
        {/* Chat / Store Icons (Simplified as buttons) */}
        <button style={{ backgroundColor: '#fff0e6', border: 'none', borderRadius: '8px', width: '44px', height: '100%', cursor: 'pointer', fontSize: '18px' }}>💬</button>
        
        {/* Add To Cart */}
        <button style={{
          flex: 1,
          backgroundColor: '#f50', // দারাজ অরেঞ্জ
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Add to Cart
        </button>

        {/* Buy Now */}
        <button style={{
          flex: 1,
          backgroundColor: '#ff1447', // ব্রাইট রেড বাই বাটন
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Buy Now
        </button>
      </div>

    </div>
  );
}