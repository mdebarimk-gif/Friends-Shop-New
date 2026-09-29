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
    colors: '',
    sizes: '',
    description: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setMessage('❌ লগইন করা নেই।');
        window.location.href = '/login';
        return;
      }

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      console.log('🔐 SESSION USER ID:', data.session.user.id);
      console.log('📧 SESSION EMAIL:', data.session.user.email);
      console.log('👤 GET USER ID:', userData.user?.id);
      console.log('📧 GET USER EMAIL:', userData.user?.email);
      console.log('❌ GET USER ERROR:', userError);

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

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setVideoFile(null);
      setVideoPreview('');
      return;
    }

    if (!file.type.startsWith('video/')) {
      setMessage('❌ শুধু Video ফাইল নির্বাচন করুন।');
      e.target.value = '';
      setVideoFile(null);
      setVideoPreview('');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setMessage('❌ ভিডিওর সাইজ সর্বোচ্চ 50 MB হতে পারবে।');
      e.target.value = '';
      setVideoFile(null);
      setVideoPreview('');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
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
      // বর্তমান Supabase login session নিশ্চিত করা
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        setMessage('❌ Admin login পাওয়া যাচ্ছে না। আবার লগইন করুন।');
        setSaving(false);
        return;
      }

      // Admin account নিশ্চিত করা
      if (authData.user.id !== 'a5e0973b-b8a0-4891-8353-53e130fe51bc') {
        setMessage('❌ এই account থেকে পণ্য যোগ করার অনুমতি নেই।');
        setSaving(false);
        return;
      }
      const imageUrls: string[] = [];
      let videoUrl = '';

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

      // Product Video Upload
      if (videoFile) {
        const videoExt =
          videoFile.name.split('.').pop()?.toLowerCase() ||
          'mp4';

        const videoFileName =
          `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}.${videoExt}`;

        const videoPath = `products/videos/${videoFileName}`;

        const { error: videoUploadError } = await supabase.storage
          .from('product-images')
          .upload(videoPath, videoFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (videoUploadError) {
          console.error(videoUploadError);

          if (uploadedFilePaths.length > 0) {
            await supabase.storage
              .from('product-images')
              .remove(uploadedFilePaths);
          }

          setMessage(
            `❌ ভিডিও Upload করা যায়নি: ${videoUploadError.message}`
          );

          setSaving(false);
          return;
        }

        uploadedFilePaths.push(videoPath);

        const { data: videoPublicUrlData } =
          supabase.storage
            .from('product-images')
            .getPublicUrl(videoPath);

        videoUrl = videoPublicUrlData.publicUrl;
      }

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

          // Product Colors
          colors: productData.colors
            ? productData.colors
                .split(',')
                .map((color) => color.trim())
                .filter(Boolean)
            : [],

          // Product Sizes
          sizes: productData.sizes
            ? productData.sizes
                .split(',')
                .map((size) => size.trim())
                .filter(Boolean)
            : [],

          // প্রথম ছবি
          image_url: mainImageUrl,

          // সব ছবির URL
          image_urls: imageUrls,

          // Product Video URL
          video_url: videoUrl || null,
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
        colors: '',
        sizes: '',
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

        {/* Colors */}
        <label style={labelStyle}>
          পণ্যের রং
          <input
            type="text"
            value={productData.colors}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value,
              })
            }
            placeholder="যেমন: Black, White, Red, Blue"
            style={inputStyle}
          />
          <div
            style={{
              marginTop: '5px',
              fontSize: '11px',
              color: '#777',
            }}
          >
            একাধিক রং দিতে কমা (,) ব্যবহার করুন।
          </div>
        </label>

        {/* Sizes */}
        <label style={labelStyle}>
          পণ্যের সাইজ
          <input
            type="text"
            value={productData.sizes}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value,
              })
            }
            placeholder="যেমন: S, M, L, XL, XXL"
            style={inputStyle}
          />
          <div
            style={{
              marginTop: '5px',
              fontSize: '11px',
              color: '#777',
            }}
          >
            একাধিক সাইজ দিতে কমা (,) ব্যবহার করুন।
          </div>
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
        <div style={{ marginTop: '20px' }}>
          <label
            htmlFor="product-video-upload"
            style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            🎥 Product Video
          </label>

          <input
            id="product-video-upload"
            name="product-video"
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              if (!file.type.startsWith('video/')) {
                setMessage('❌ এটি Video ফাইল নয়।');
                e.target.value = '';
                return;
              }

              if (file.size > 50 * 1024 * 1024) {
                setMessage('❌ ভিডিওর সাইজ সর্বোচ্চ 50 MB হতে পারবে।');
                e.target.value = '';
                return;
              }

              setVideoFile(file);
              setVideoPreview(URL.createObjectURL(file));
              setMessage('✅ ভিডিও নির্বাচন করা হয়েছে।');
            }}
          />

          {videoPreview && (
            <video
              src={videoPreview}
              controls
              style={{
                width: '100%',
                maxWidth: '400px',
                marginTop: '10px',
                borderRadius: '8px',
              }}
            />
          )}
        </div>

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
