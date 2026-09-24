'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

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

const categoryNames: Record<string, string> = {
  fashion: '👕 Fashion',
  gadgets: '🎧 Gadgets',
  mart: '🛒 Mart',
  beauty: '💄 Beauty',
  'natural-food': '🥜 Natural Food',
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      const { slug: categorySlug } = await params;

      setSlug(categorySlug);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categorySlug)
        .order('id', { ascending: false });

      if (error) {
        console.error(error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    loadCategory();
  }, [params]);

  const categoryName =
    categoryNames[slug] || 'Products';

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: '30px 15px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '15px',
            fontWeight: '700',
          }}
        >
          ⏳ Products loading...
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '800',
            }}
          >
            {categoryName}
          </h1>

          <p
            style={{
              margin: '5px 0 0',
              fontSize: '12px',
              color: '#777',
            }}
          >
            {products.length} টি পণ্য পাওয়া গেছে
          </p>
        </div>

        <Link
          href="/"
          style={{
            textDecoration: 'none',
            backgroundColor: '#ff4600',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '7px',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          🏠 Home
        </Link>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '40px 15px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '45px',
              marginBottom: '10px',
            }}
          >
            📦
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: '17px',
            }}
          >
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h2>

          <p
            style={{
              color: '#777',
              fontSize: '13px',
              marginTop: '7px',
            }}
          >
            Admin Panel থেকে এই ক্যাটাগরিতে পণ্য যোগ করুন।
          </p>

          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '12px',
              backgroundColor: '#ff4600',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            ← Home-এ ফিরে যান
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(2, minmax(0, 1fr))',
            gap: '10px',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '9px',
                overflow: 'hidden',
                border: '1px solid #eee',
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  backgroundColor: '#f7f7f7',
                  overflow: 'hidden',
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
                      display: 'block',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                    }}
                  >
                    📦
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div
                style={{
                  padding: '10px',
                }}
              >
                {product.tag && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#ff4600',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {product.tag}
                  </div>
                )}

                <h2
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '700',
                    lineHeight: '1.4',
                  }}
                >
                  {product.title}
                </h2>

                <div
                  style={{
                    marginTop: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      color: '#ff4600',
                      fontSize: '16px',
                      fontWeight: '800',
                    }}
                  >
                    ৳{product.price}
                  </span>

                  {product.old_price && (
                    <span
                      style={{
                        color: '#999',
                        fontSize: '12px',
                        textDecoration:
                          'line-through',
                      }}
                    >
                      ৳{product.old_price}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '10px',
                    color:
                      product.stock > 0
                        ? '#777'
                        : '#d32f2f',
                  }}
                >
                  স্টক: {product.stock}
                </div>

                <button
                  disabled={product.stock <= 0}
                  style={{
                    width: '100%',
                    marginTop: '9px',
                    padding: '9px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor:
                      product.stock > 0
                        ? '#ff4600'
                        : '#999',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700',
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
