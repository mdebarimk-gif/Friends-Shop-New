'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AddProduct() {
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    oldPrice: '',
    category: 'fashion',
    stock: '',
    tag: 'Free Shipping 🚚',
    description: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // =========================
  // ADMIN LOGIN CHECK
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.href = '/login';
        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // =========================
  // IMAGE SELECT
  // =========================
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ ছবির সাইজ ৫ MB-এর বেশি হতে পারবে না।');
      return;
    }

    // Image only
    if (!file.type.startsWith('image/')) {
      setMessage('❌ শুধু Image ফাইল নির্বাচন করুন।');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage('');
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !productData.title ||
      !productData.price ||
      !productData.stock
    ) {
      setMessage('দয়া করে প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }

    if (!imageFile) {
      setMessage('❌ দয়া করে পণ্যের একটি ছবি নির্বাচন করুন।');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      // =========================
      // 1. UPLOAD IMAGE
      // =========================
      const fileExt = imageFile.name.split('.').pop();

      const safeFileName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${fileExt}`;

      const filePath = `products/${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        setMessage(
          `❌ ছবি Upload করা যায়নি: ${uploadError.message}`
        );
        setSaving(false);
        return;
      }

      // =========================
      // 2. GET PUBLIC IMAGE URL
      // =========================
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // =========================
      // 3. SAVE PRODUCT
      // =========================
      const { error: productError } = await supabase
        .from('products')
        .insert({
          title: productData.title,
          price: Number(productData.price),
          old_price: productData.oldPrice
            ? Number(productData.oldPrice)
            : null,
          category: productData.category,
          stock: Number(productData.stock),
          tag: productData.tag,
          description: productData.description,
          image_url: imageUrl,
        });

      if (productError) {
        console.error(productError);

        // Product save না হলে uploaded image মুছে দেওয়ার চেষ্টা
        await supabase.storage
          .from('product-images')
          .remove([filePath]);

        setMessage(
          `❌ পণ্য সংরক্ষণ করা যায়নি: ${productError.message}`
        );
        setSaving(false);
        return;
      }

      // =========================
      // 4. SUCCESS
      // =========================
      setMessage(
        '✅ পণ্য ও ছবি সফলভাবে Supabase-এ সংরক্ষণ হয়েছে!'
      );

      setProductData({
        title: '',
        price: '',
        oldPrice: '',
        category: 'fashion',
        stock: '',
        tag: 'Free Shipping 🚚',
        description: '',
      });

      setImageFile(null);
      setImagePreview('');

      // File input reset
      const fileInput = document.getElementById(
        'product-image'
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ একটি অপ্রত্যাশিত সমস্যা হয়েছে।');
    }

    setSaving(false);
  };

  // =========================
  // AUTH CHECK SCREEN
  // =========================
  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f4f4f4',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#555',
          }}
        >
          🔐 Checking login...
        </p>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '12px',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '12px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '800',
          }}
        >
          Add New Product
        </h1>

        <p
          style={{
            margin: '5px 0 0',
            fontSize: '12px',
            color: '#777',
          }}
        >
          ইনভেন্টরিতে নতুন পণ্য যোগ করুন
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* PRODUCT NAME */}
        <label style={labelStyle}>
          পণ্যের নাম *
          <input
            type="text"
            value={productData.title}
            onChange={(e) =>
              setProductData({
                ...productData,
                title: e.target.value,
              })
            }
            placeholder="Product name"
            required
            style={inputStyle}
          />
        </label>

        {/* PRICE */}
        <label style={labelStyle}>
          বিক্রয় মূল্য *
          <input
            type="number"
            min="0"
            value={productData.price}
            onChange={(e) =>
              setProductData({
                ...productData,
                price: e.target.value,
              })
            }
            placeholder="Price"
            required
            style={inputStyle}
          />
        </label>

        {/* OLD PRICE */}
        <label style={labelStyle}>
          পুরাতন মূল্য
          <input
            type="number"
            min="0"
            value={productData.oldPrice}
            onChange={(e) =>
              setProductData({
                ...productData,
                oldPrice: e.target.value,
              })
            }
            placeholder="Old price"
            style={inputStyle}
          />
        </label>

        {/* CATEGORY */}
        <label style={labelStyle}>
          ক্যাটাগরি
          <select
            value={productData.category}
            onChange={(e) =>
              setProductData({
                ...productData,
                category: e.target.value,
              })
            }
            style={inputStyle}
          >
            <option value="fashion">Fashion</option>
            <option value="gadgets">Gadgets</option>
            <option value="mart">Mart</option>
            <option value="beauty">Beauty</option>
          </select>
        </label>

        {/* STOCK */}
        <label style={labelStyle}>
          স্টক সংখ্যা *
          <input
            type="number"
            min="0"
            value={productData.stock}
            onChange={(e) =>
              setProductData({
                ...productData,
                stock: e.target.value,
              })
            }
            placeholder="Stock"
            required
            style={inputStyle}
          />
        </label>

        {/* TAG */}
        <label style={labelStyle}>
          পণ্যের ট্যাগ
          <select
            value={productData.tag}
            onChange={(e) =>
              setProductData({
                ...productData,
                tag: e.target.value,
              })
            }
            style={inputStyle}
          >
            <option>Free Shipping 🚚</option>
            <option>Free Gift 🎁</option>
            <option>Best Seller 🔥</option>
            <option>Top Deal ⚡</option>
          </select>
        </label>

        {/* IMAGE */}
        <label style={labelStyle}>
          পণ্যের ছবি *

          <input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{
              ...inputStyle,
              padding: '9px',
            }}
          />
        </label>

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '8px',
              backgroundColor: '#fafafa',
            }}
          >
            <p
              style={{
                margin: '0 0 7px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#555',
              }}
            >
              ছবির Preview
            </p>

            <img
              src={imagePreview}
              alt="Product preview"
              style={{
                display: 'block',
                width: '100%',
                maxHeight: '250px',
                objectFit: 'contain',
                borderRadius: '6px',
              }}
            />
          </div>
        )}

        {/* DESCRIPTION */}
        <label style={labelStyle}>
          পণ্যের বিবরণ

          <textarea
            value={productData.description}
            onChange={(e) =>
              setProductData({
                ...productData,
                description: e.target.value,
              })
            }
            placeholder="Product description"
            rows={4}
            style={{
              ...inputStyle,
              resize: 'vertical',
            }}
          />
        </label>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              padding: '10px',
              borderRadius: '7px',
              backgroundColor: message.startsWith('✅')
                ? '#e8f5e9'
                : '#ffebee',
              color: message.startsWith('✅')
                ? '#2e7d32'
                : '#c62828',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            {message}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={saving}
          style={{
            backgroundColor: saving ? '#999' : '#ff4600',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '13px',
            fontSize: '14px',
            fontWeight: '800',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving
            ? 'Uploading & Saving...'
            : '🚀 Submit & Publish Product'}
        </button>

        {/* BACK */}
        <a
          href="/admin"
          style={{
            textAlign: 'center',
            textDecoration: 'none',
            color: '#555',
            fontSize: '13px',
            fontWeight: '700',
            padding: '8px',
          }}
        >
          ← Back to Admin Dashboard
        </a>
      </form>
    </main>
  );
}

// =========================
// STYLES
// =========================

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '700',
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: '5px',
  padding: '11px',
  boxSizing: 'border-box',
  border: '1px solid #ddd',
  borderRadius: '7px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#fff',
};
