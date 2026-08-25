'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../components/CartContext';

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

export default function SearchPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase().trim();

    if (!text) return true;

    return (
      product.title?.toLowerCase().includes(text) ||
      product.category?.toLowerCase().includes(text) ||
      product.description?.toLowerCase().includes(text)
    );
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      setMessage('❌ এই পণ্যটি বর্তমানে Stock-এ নেই।');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image_url || '',
    });

    setMessage(`✓ "${product.title}" Cart-এ যোগ হয়েছে`);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        paddingBottom: '30px',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '15px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          borderBottom: '1px solid #eeeeee',
        }}
      >
        <h1
          style={{
            margin: '0 0 12px',
            fontSize: '20px',
            fontWeight: '800',
            color: '#212121',
          }}
        >
          🔎 Search Products
        </h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="পণ্যের নাম লিখে খুঁজুন..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #dddddd',
            outline: 'none',
            fontSize: '14px',
            backgroundColor: '#fafafa',
          }}
        />
      </div>

      {/* Success Message */}
      {message && (
        <div
          style={{
            position: 'fixed',
            top: '75px',
            left: '15px',
            right: '15px',
            zIndex: 50,
            backgroundColor: '#212121',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          {message}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 15px',
          }}
        >
          ⏳ পণ্য লোড হচ্ছে...
        </div>
      )}

      {/* No Product */}
      {!loading && filteredProducts.length === 0 && (
        <div
          style={{
            backgroundColor: '#ffffff',
            margin: '15px',
            padding: '30px 15px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '45px' }}>😕</div>

          <h2
            style={{
              fontSize: '17px',
              margin: '10px 0',
            }}
          >
            কোনো পণ্য পাওয়া যায়নি
          </h2>

          <p
            style={{
              fontSize: '12px',
              color: '#757575',
            }}
          >
            অন্য কোনো পণ্যের নাম দিয়ে আবার চেষ্টা করুন।
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            padding: '12px',
          }}
        >
          {filteredProducts.map((product) => {
            const discount =
              product.old_price &&
              product.old_price > product.price
                ? Math.round(
                    ((product.old_price - product.price) /
                      product.old_price) *
                      100
                  )
                : 0;

            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                {/* Image */}
                <Link
                  href={`/product/${product.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '170px',
                      backgroundColor: '#f8f8f8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '55px' }}>
                        🛍️
                      </span>
                    )}
                  </div>
                </Link>

                {/* Details */}
                <div
                  style={{
                    padding: '10px',
                  }}
                >
                  <Link
                    href={`/product/${product.id}`}
                    style={{
                      textDecoration: 'none',
                      color: '#212121',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.4',
                        margin: '0 0 7px',
                        fontWeight: '600',
                        minHeight: '36px',
                      }}
                    >
                      {product.title}
                    </h2>
                  </Link>

                  {/* Price */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '17px',
                        fontWeight: '800',
                        color: '#ff4600',
                      }}
                    >
                      ৳{product.price}
                    </span>

                    {product.old_price &&
                      product.old_price > product.price && (
                        <span
                          style={{
                            fontSize: '10px',
                            color: '#999999',
                            textDecoration: 'line-through',
                          }}
                        >
                          ৳{product.old_price}
                        </span>
                      )}
                  </div>

                  {discount > 0 && (
                    <div
                      style={{
                        marginTop: '4px',
                        fontSize: '10px',
                        color: '#ff4600',
                        fontWeight: '700',
                      }}
                    >
                      -{discount}% OFF
                    </div>
                  )}

                  {/* Stock */}
                  <div
                    style={{
                      marginTop: '5px',
                      fontSize: '10px',
                      color:
                        product.stock > 0
                          ? '#2e7d32'
                          : '#d32f2f',
                    }}
                  >
                    {product.stock > 0
                      ? `Stock: ${product.stock}`
                      : 'Out of Stock'}
                  </div>

                  {/* Add To Cart */}
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
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
