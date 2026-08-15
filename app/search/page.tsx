'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const products = [
  { id: '1', name: 'Wireless Headphone', price: 1250, category: 'Gadgets', emoji: '🎧' },
  { id: '2', name: 'Luxury Men Watch', price: 1850, category: 'Fashion', emoji: '⌚' },
  { id: '3', name: 'Ladies Bag', price: 1200, category: 'Fashion', emoji: '👜' },
  { id: '4', name: 'Wireless Earbuds', price: 1450, category: 'Gadgets', emoji: '🎧' },
  { id: '5', name: 'Face Wash', price: 350, category: 'Beauty', emoji: '🧴' },
  { id: '6', name: "Men's T-Shirt", price: 650, category: 'Fashion', emoji: '👕' },
  { id: '7', name: 'Prayer Beads', price: 89, category: 'Mart', emoji: '📿' },
  { id: '8', name: 'Sports Shoes', price: 750, category: 'Fashion', emoji: '👟' },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const query = rawQuery.trim().toLowerCase();

  const results = products.filter((product) => {
    if (!query) return true;

    const text = [
      product.name,
      product.category,
      product.price.toString(),
    ]
      .join(' ')
      .toLowerCase();

    return text.includes(query);
  });

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '14px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '12px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '800',
            color: '#222222',
          }}
        >
          {rawQuery
            ? `Search results for "${rawQuery}"`
            : 'All Products'}
        </h1>

        <p
          style={{
            margin: '6px 0 0',
            fontSize: '12px',
            color: '#777777',
          }}
        >
          {results.length}টি পণ্য পাওয়া গেছে
        </p>
      </div>

      {results.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '50px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '45px', marginBottom: '10px' }}>
            🔍
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: '16px',
              color: '#333333',
            }}
          >
            কোনো পণ্য পাওয়া যায়নি
          </h2>

          <p
            style={{
              fontSize: '12px',
              color: '#888888',
              marginTop: '6px',
            }}
          >
            অন্য পণ্যের নাম দিয়ে আবার চেষ্টা করুন।
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '10px',
          }}
        >
          {results.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              style={{
                display: 'block',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                padding: '8px',
                textDecoration: 'none',
                color: '#222222',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  height: '130px',
                  backgroundColor: '#f8f8f8',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '52px',
                }}
              >
                {product.emoji}
              </div>

              <div
                style={{
                  marginTop: '7px',
                  fontSize: '10px',
                  color: '#888888',
                }}
              >
                {product.category}
              </div>

              <h3
                style={{
                  margin: '3px 0',
                  fontSize: '13px',
                  lineHeight: '1.3',
                }}
              >
                {product.name}
              </h3>

              <strong
                style={{
                  fontSize: '15px',
                  color: '#ff4600',
                }}
              >
                ৳{product.price}
              </strong>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
          }}
        >
          Search হচ্ছে...
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
