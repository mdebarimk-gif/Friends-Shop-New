'use client';

import React, { useState } from 'react';
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

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData.title || !productData.price || !productData.stock) {
      setMessage('দয়া করে প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }

    setSaving(true);
    setMessage('');

    const { error } = await supabase.from('products').insert({
      title: productData.title,
      price: Number(productData.price),
      old_price: productData.oldPrice
        ? Number(productData.oldPrice)
        : null,
      category: productData.category,
      stock: Number(productData.stock),
      tag: productData.tag,
      description: productData.description,
      image_url: null,
    });

    setSaving(false);

    if (error) {
      console.error(error);
      setMessage('❌ পণ্য সংরক্ষণ করা যায়নি।');
      return;
    }

    setMessage('✅ পণ্য সফলভাবে Supabase-এ সংরক্ষণ হয়েছে!');

    setProductData({
      title: '',
      price: '',
      oldPrice: '',
      category: 'fashion',
      stock: '',
      tag: 'Free Shipping 🚚',
      description: '',
    });
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '12px',
      }}
    >
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
        <label style={{ fontSize: '13px', fontWeight: '700' }}>
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

        <label style={{ fontSize: '13px', fontWeight: '700' }}>
          বিক্রয় মূল্য *
          <input
            type="number"
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

        <label style={{ fontSize: '13px', fontWeight: '700' }}>
          পুরাতন মূল্য
          <input
            type="number"
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

        <label style={{ fontSize: '13px', fontWeight: '700' }}>
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

        <label style={{ fontSize: '13px', fontWeight: '700' }}>
          স্টক সংখ্যা *
          <input
            type="number"
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

        <label style={{ fontSize: '13px', fontWeight: '700' }}>
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

        <label style={{ fontSize: '13px', fontWeight: '700' }}>
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
          }}
        >
          {saving ? 'Saving...' : '🚀 Submit & Publish Product'}
        </button>
      </form>
    </main>
  );
}

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
