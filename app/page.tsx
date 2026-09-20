'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../components/CartContext';

type Product = {
  id: number;
  title: string;
  price: number;
  old_price: number | null;
  category: string;
  stock: number;
  tag: string | null;
  description: string | null;
  image_url: string | null;
};

const categoryEmoji: Record<string, string> = {
  fashion: '👕',
  gadgets: '📱',
  mart: '🍏',
  beauty: '💄',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('bn-BD').format(price);
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('এই পণ্যটি বর্তমানে Stock-এ নেই।');
      return;
    }

    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image_url || '',
    });

    alert(`🛒 "${product.title}" Cart-এ যোগ হয়েছে!`);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '12px',
        boxSizing: 'border-box',
      }}
    >
      {/* HERO */}
      <div
        style={{
          position: 'relative',
          height: '210px',
          borderRadius: '14px',
          overflow: 'hidden',
          marginBottom: '12px',
          backgroundImage: "url('/hero-banner.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <a
          href="#products"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'block',
          }}
          aria-label="এখনই শপ করুন"
        />
      </div>

      {/* VOUCHER */}
      <div
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontWeight: '700',
              fontSize: '15px',
            }}
          >
            Claim Vouchers to Save More!
          </div>

          <div
            style={{
              color: '#f50',
              fontSize: '11px',
              marginTop: '3px',
            }}
          >
            ৳৪০ Free Shipping • ৫% OFF
          </div>
        </div>

        <button
          style={{
            background: '#ff4600',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 14px',
            fontWeight: '700',
          }}
        >
          Collect
        </button>
      </div>

      {/* SPECIAL OFFER */}
      <div
        style={{
          marginBottom: '20px',
          padding: '16px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #ff6b35, #ff1744)',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: '900', marginBottom: '5px' }}>
          🔥 Special Offer
        </div>

        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>
          নির্বাচিত পণ্যে চলছে বিশেষ ছাড়!
        </div>

        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
          আজই অর্ডার করুন — অফার সীমিত সময়ের জন্য।
        </div>

        <div
          style={{
            display: 'inline-block',
            background: '#fff',
            color: '#e53935',
            padding: '5px 12px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '900',
            marginBottom: '12px',
          }}
        >
          🎉 UP TO 20% OFF
        </div>

        <div style={{ marginBottom: '12px', fontSize: '14px' }}>
          <span
            style={{
              textDecoration: 'line-through',
              opacity: 0.8,
              marginRight: '8px',
            }}
          >
            ৳1,000
          </span>

          <strong style={{ fontSize: '20px' }}>
            ৳800
          </strong>
        </div>

        <a
          href="#products"
          style={{
            display: 'inline-block',
            background: '#fff',
            color: '#e53935',
            padding: '8px 18px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '800',
          }}
        >
          🛒 এখনই কিনুন
        </a>
      </div>

      {/* CATEGORY */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              margin: 0,
              fontWeight: '800',
            }}
          >
            ✨ Featured Categories
          </h2>

          <span
            style={{
              fontSize: '11px',
              color: '#777',
            }}
          >
            সব ক্যাটাগরি
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '7px',
          }}
        >
          {[
            ['fashion', '👕', 'Fashion', '#e3f2fd'],
            ['gadgets', '🎧', 'Gadgets', '#f3e5f5'],
            ['mart', '🛒', 'Mart', '#e8f5e9'],
            ['beauty', '💄', 'Beauty', '#fce4ec'],
            ['natural-food', '🥜', 'Natural Food', '#fff8e1'],
          ].map(([key, emoji, name, bgColor]) => (
            <a
              key={key}
              href={`/category/${key}`}
              style={{
                textDecoration: 'none',
                color: '#333',
                textAlign: 'center',
                background: bgColor,
                borderRadius: '12px',
                padding: '10px 3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #bdbdbd',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  margin: '0 auto 6px',
                  borderRadius: '50%',
                  background: '#fff4e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                {emoji}
              </div>

              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                }}
              >
                {name}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* PRODUCTS HEADER */}
      <div id="products"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h2
          style={{
            fontSize: '16px',
            margin: 0,
          }}
        >
          🛍️ Featured Products
        </h2>

        <span
          style={{
            color: '#ff4600',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          {products.length} টি পণ্য
        </span>
      </div>

      {/* LOADING */}
      {loading ? (
        <div
          style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '25px',
            textAlign: 'center',
          }}
        >
          পণ্য লোড হচ্ছে...
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '25px',
            textAlign: 'center',
          }}
        >
          এখনো কোনো পণ্য যোগ করা হয়নি।
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '8px',
                color: '#212121',
                boxShadow:
                  '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              {/* PRODUCT IMAGE / LINK */}
              <a
                href={`/product/${product.id}`}
                style={{
                  textDecoration: 'none',
                  color: '#212121',
                }}
              >
                <div
                  style={{
                    height: '130px',
                    background: '#f9f9f9',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    fontSize: '55px',
                  }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    categoryEmoji[
                      product.category
                    ] || '📦'
                  )}
                </div>

                {product.tag && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      background: '#fff0e6',
                      color: '#ff4600',
                      fontSize: '9px',
                      fontWeight: '700',
                      padding: '2px 5px',
                      borderRadius: '3px',
                    }}
                  >
                    {product.tag}
                  </span>
                )}

                <h3
                  style={{
                    fontSize: '13px',
                    margin: '6px 0',
                    fontWeight: '600',
                    lineHeight: '1.4',
                  }}
                >
                  {product.title}
                </h3>

                <div
                  style={{
                    color: '#ff4600',
                    fontSize: '16px',
                    fontWeight: '800',
                  }}
                >
                  ৳{formatPrice(product.price)}
                </div>

                {product.old_price &&
                  product.old_price > product.price && (
                    <div
                      style={{
                        color: '#999',
                        fontSize: '10px',
                        textDecoration: 'line-through',
                      }}
                    >
                      ৳{formatPrice(product.old_price)}
                    </div>
                  )}

                <div
                  style={{
                    color:
                      product.stock > 0
                        ? '#777'
                        : '#d32f2f',
                    fontSize: '10px',
                    marginTop: '4px',
                  }}
                >
                  স্টক: {product.stock}
                </div>
              </a>

              {/* ADD TO CART */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                style={{
                  width: '100%',
                  marginTop: '9px',
                  padding: '10px 5px',
                  border: 'none',
                  borderRadius: '7px',
                  backgroundColor:
                    product.stock > 0
                      ? '#ff4600'
                      : '#999999',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor:
                    product.stock > 0
                      ? 'pointer'
                      : 'not-allowed',
                }}
              >
                {product.stock > 0
                  ? '🛒 Add to Cart'
                  : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
