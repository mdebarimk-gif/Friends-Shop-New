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

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setMessage('❌ শুধু Image ফাইল নির্বাচন করুন।');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage(
          `❌ "${file.name}" ছবির সাইজ ৫ MB-এর বেশি।`
        );
        return;
      }
    }

    setImageFiles(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !productData.title ||
      !productData.price ||
      !productData.stock
    ) {
      setMessage('❌ দয়া করে প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }

    if (imageFiles.length === 0) {
      setMessage(
        '❌ দয়া করে পণ্যের অন্তত একটি ছবি নির্বাচন করুন।'
      );
      return;
    }

    setSaving(true);
    setMessage('');

    const uploadedFilePaths: string[] = [];

    try {
      const imageUrls: string[] = [];

      // সব ছবি Upload
      for (const imageFile of imageFiles) {
        const fileExt =
          imageFile.name.split('.').pop()?.toLowerCase() ||
          'jpg';

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

          // আগে Upload হওয়া ছবিগুলো মুছে ফেলবে
          if (uploadedFilePaths.length > 0) {
            await supabase.storage
              .from('product-images')
              .remove(uploadedFilePaths);
          }

          setMessage(
            `❌ "${imageFile.name}" Upload করা যায়নি: ${uploadError.message}`
          );

          setSaving(false);
          return;
        }

        uploadedFilePaths.push(filePath);

        const { data: publicUrlData } =
          supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        imageUrls.push(publicUrlData.publicUrl);
      }

      // প্রথম ছবিটি প্রধান ছবি
      const mainImageUrl = imageUrls[0];

      // Product Supabase-এ Save
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

          // প্রথম ছবি
          image_url: mainImageUrl,

          // সব ছবির URL
          image_urls: imageUrls,
        });

      if (productError) {
        console.error(productError);

        // Product Save না হলে সব Upload করা ছবি মুছে ফেলবে
        if (uploadedFilePaths.length > 0) {
          await supabase.storage
            .from('product-images')
            .remove(uploadedFilePaths);
        }

        setMessage(
          `❌ পণ্য সংরক্ষণ করা যায়নি: ${productError.message}`
        );

        setSaving(false);
        return;
      }

      // সফল
      setMessage(
        `✅ পণ্য সফলভাবে সংরক্ষণ হয়েছে! মোট ${imageUrls.length}টি ছবি যোগ হয়েছে।`
      );

      // Form Reset
      setProductData({
        title: '',
        price: '',
        oldPrice: '',
        category: 'fashion',
        stock: '',
        tag: 'Free Shipping 🚚',
        description: '',
      });

      setImageFiles([]);
      setImagePreviews([]);

      const fileInput = document.getElementById(
        'product-image'
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error(error);

      // কোনো অপ্রত্যাশিত সমস্যা হলে Upload করা ছবি মুছে ফেলবে
      if (uploadedFilePaths.length > 0) {
        await supabase.storage
          .from('product-images')
          .remove(uploadedFilePaths);
      }

      setMessage('❌ একটি অপ্রত্যাশিত সমস্যা হয়েছে।');
    }

    setSaving(false);
  };

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

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '12px',
      }}
    >
      {/* Header */}
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

      {/* Form */}
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
        {/* Product Name */}
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

        {/* Price */}
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

        {/* Old Price */}
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

        {/* Category */}
        <label style={labelStyle}>
          ক্যাটাগরি *

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
            <option value="fashion">
              Fashion 👕
            </option>

            <option value="gadgets">
              Gadgets 🎧
            </option>

            <option value="mart">
              Mart 🛒
            </option>

            <option value="beauty">
              Beauty 💄
            </option>

            <option value="natural-food">
              Natural Food 🥜
            </option>
          </select>
        </label>

        {/* Stock */}
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

        {/* Tag */}
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

        {/* Multiple Images */}
        <label style={labelStyle}>
          পণ্যের ছবি *

          <input
            id="product-image"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            style={{
              ...inputStyle,
              padding: '9px',
            }}
          />

          <span
            style={{
              display: 'block',
              marginTop: '5px',
              fontSize: '11px',
              color: '#777',
              fontWeight: '500',
            }}
          >
            একসাথে একাধিক ছবি নির্বাচন করতে পারবেন। প্রতিটি ছবি
            সর্বোচ্চ ৫ MB।
          </span>
        </label>

        {/* Image Preview */}
        {imagePreviews.length > 0 && (
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#fafafa',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#555',
              }}
            >
              🖼️ নির্বাচিত ছবি: {imagePreviews.length}টি
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {imagePreviews.map((preview, index) => (
                <div
                  key={preview}
                  style={{
                    position: 'relative',
                    borderRadius: '7px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                  }}
                >
                  <img
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '110px',
                      objectFit: 'cover',
                    }}
                  />

                  {index === 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        left: '4px',
                        bottom: '4px',
                        backgroundColor: '#ff4600',
                        color: '#fff',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '800',
                      }}
                    >
                      প্রধান ছবি
                    </span>
                  )}

                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: '700',
                    }}
                  >
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
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

        {/* Message */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          style={{
            backgroundColor: saving
              ? '#999'
              : '#ff4600',

            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '13px',
            fontSize: '14px',
            fontWeight: '800',
            cursor: saving
              ? 'not-allowed'
              : 'pointer',
          }}
        >
          {saving
            ? 'Uploading & Saving...'
            : '🚀 Submit & Publish Product'}
        </button>

        {/* Back */}
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

/* Label Style */
const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '700',
};

/* Input Style */
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
