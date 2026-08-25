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
          background:
            'linear-gradient(135deg, #f50 0%, #ff85c0 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: '#fff',
          marginBottom: '12px',
        }}
      >
        <h1
          style={{
            fontSize: '20px',
            fontWeight: '800',
            margin: 0,
            lineHeight: '1.3',
          }}
        >
          সবচেয়ে কম দামে
          <br />
          সেরা কেনাকাটা!
        </h1>

        <p
          style={{
            fontSize: '12px',
            margin: '6px 0 0',
          }}
        >
          Friends Shop-এ পাচ্ছেন ফ্রি শিপিং ও অফার।
        </p>
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
              fontSize: '13px',
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

      {/* CATEGORY */}
      <h2
        style={{
          fontSize: '16px',
          margin: '0 0 10px',
        }}
      >
        ক্যাটাগরি সমূহ
      </h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        {[
          ['fashion', 'Fashion'],
          ['gadgets', 'Gadgets'],
          ['mart', 'Mart'],
          ['beauty', 'Beauty'],
        ].map(([key, name]) => (
          <a
            key={key}
            href={`/category/${key}`}
            style={{
              textDecoration: 'none',
              color: '#424242',
              textAlign: 'center',
              width: '24%',
            }}
          >
            <div
              style={{
                width: '45px',
                height: '45px',
                margin: '0 auto 5px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
              }}
            >
              {categoryEmoji[key]}
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {name}
            </span>
          </a>
        ))}
      </div>

      {/* PRODUCTS HEADER */}
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
          }}
        >
          🛍️ আমাদের পণ্য
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
                    borderRadius: '8px',
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
