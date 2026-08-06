'use client';

import React, { useState } from 'react';

export default function AddProduct() {
  // ফর্ম স্টেট হ্যান্ডেল করার জন্য
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    oldPrice: '',
    category: 'fashion',
    stock: '',
    tag: 'Free Shipping 🚚',
    description: '',
  });

  const [imagePreview, setImagePreview] = useState('📦');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData.title || !productData.price || !productData.stock) {
      alert('দয়া করে প্রয়োজনীয় সব তথ্য পূরণ করুন!');
      return;
    }
    
    alert(`সফলভাবে পণ্য যুক্ত হয়েছে!\n\nনাম: ${productData.title}\nমূল্য: ৳${productData.price}\nস্টক: ${productData.stock} টি\nক্যাটাগরি: ${productData.category}`);
    
    // ফর্ম রিসেট করা
    setProductData({
      title: '',
      price: '',
      oldPrice: '',
      category: 'fashion',
      stock: '',
      tag: 'Free Shipping 🚚',
      description: '',
    });
    setImagePreview('📦');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '14px', 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh',
      padding: '12px',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      
      {/* ==================== FORM HEADER ==================== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
        <a href="/admin" style={{ textDecoration: 'none', fontSize: '18px', color: '#ff4600' }}>←</a>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#212121' }}>Add New Product</h1>
          <span style={{ fontSize: '11px', color: '#757575' }}>ইনভেন্টরিতে নতুন পণ্য যোগ করুন</span>
        </div>
      </div>

      {/* ==================== FORM CONTENT ==================== */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Product Image Upload Section */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ backgroundColor: '#f9f9f9', width: '90px', height: '90px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '45px', border: '1px dashed #d9d9d9' }}>
            {imagePreview}
          </div>
          <label style={{ backgroundColor: '#fff0e6', color: '#ff4600', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #ffbb96' }}>
            📷 Upload Product Image
            <input 
              type="file" 
              accept="image/*" 
              onChange={() => setImagePreview('🖼️')} // মোবাইলে ফাইল সিলেক্টের ডামি সিমুলেশন
              style={{ display: 'none' }} 
            />
          </label>
        </div>

        {/* Core Product Info */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>পণ্যের নাম (Product Title) *</label>
            <input 
              type="text" 
              placeholder="e.g. Premium Wireless Headphone" 
              required
              value={productData.title}
              onChange={(e) => setProductData({...productData, title: e.target.value})}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>বিক্রয় মূল্য (Price) *</label>
              <input 
                type="number" 
                placeholder="৳ Price" 
                required
                value={productData.price}
                onChange={(e) => setProductData({...productData, price: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>আসল মূল্য (Old Price)</label>
              <input 
                type="number" 
                placeholder="৳ Old Price" 
                value={productData.oldPrice}
                onChange={(e) => setProductData({...productData, oldPrice: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>ক্যাটাগরি (Category)</label>
              <select 
                value={productData.category}
                onChange={(e) => setProductData({...productData, category: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', backgroundColor: '#ffffff', outline: 'none' }}
              >
                <option value="fashion">Fashion</option>
                <option value="gadgets">Gadgets</option>
                <option value="mart">Mart</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>স্টক সংখ্যা (Stock) *</label>
              <input 
                type="number" 
                placeholder="Quantity" 
                required
                value={productData.stock}
                onChange={(e) => setProductData({...productData, stock: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>প্রোডাক্ট ট্যাগ (Product Tag)</label>
            <select 
              value={productData.tag}
              onChange={(e) => setProductData({...productData, tag: e.target.value})}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="Free Shipping 🚚">Free Shipping 🚚</option>
              <option value="Free Gift 🎁">Free Gift 🎁</option>
              <option value="Best Seller 🔥">Best Seller 🔥</option>
              <option value="Top Deal ⚡">Top Deal ⚡</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>পণ্যের বিবরণ (Description)</label>
            <textarea 
              placeholder="Enter product details specifications..." 
              rows={3}
              value={productData.description}
              onChange={(e) => setProductData({...productData, description: e.target.value})}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none', resize: 'none' }}
            />
          </div>

        </div>

        {/* Submit Button */}
        <button type="submit" style={{
          backgroundColor: '#ff4600',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(255,70,0,0.15)',
          marginTop: '4px'
        }}>
          🚀 Submit & Publish Product
        </button>

      </form>
    </div>
  );
}