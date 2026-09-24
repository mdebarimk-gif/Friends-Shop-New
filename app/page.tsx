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
  'natural-food': '🥜',
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
    <main className="shop-page">
      {/* HERO */}
      <div className="hero-banner">
        <a
          href="#products"
          className="hero-link"
          aria-label="এখনই শপ করুন"
        />
      </div>

      {/* VOUCHER */}
      <div className="voucher">
        <div className="voucher-text">
          <div className="voucher-title">
            Claim Vouchers to Save More!
          </div>

          <div className="voucher-offer">
            ৳৪০ Free Shipping • ৫% OFF
          </div>
        </div>

        <button className="collect-button">
          Collect
        </button>
      </div>

      {/* SPECIAL OFFER */}
      <a
        href="#products"
        className="special-offer"
        aria-label="এখনই কিনুন"
      >
        <div className="offer-moving">
          🔥 Special Offer &nbsp; • &nbsp; UP TO 20% OFF &nbsp; • &nbsp;
          ৳1,000 → ৳800 &nbsp; • &nbsp; 🛒 এখনই কিনুন
        </div>
      </a>

      {/* CATEGORY */}
      <section className="category-section">
        <div className="section-header">
          <h2>✨ Featured Categories</h2>

          <span>সব ক্যাটাগরি</span>
        </div>

        <div className="category-grid">
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
              className="category-card"
              style={{ backgroundColor: bgColor }}
            >
              <div className="category-icon">
                {emoji}
              </div>

              <div className="category-name">
                {name}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PRODUCTS HEADER */}
      <div id="products" className="products-header">
        <h2>🛍️ Featured Products</h2>

        <span>{products.length} টি পণ্য</span>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="message-box">
          পণ্য লোড হচ্ছে...
        </div>
      ) : products.length === 0 ? (
        <div className="message-box">
          এখনো কোনো পণ্য যোগ করা হয়নি।
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
            >
              {/* PRODUCT */}
              <a
                href={`/product/${product.id}`}
                className="product-link"
              >
                <div className="product-image">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                    />
                  ) : (
                    categoryEmoji[product.category] || '📦'
                  )}
                </div>

                {product.tag && (
                  <span className="product-tag">
                    {product.tag}
                  </span>
                )}

                <h3 className="product-title">
                  {product.title}
                </h3>

                <div className="product-price">
                  ৳{formatPrice(product.price)}
                </div>

                {product.old_price &&
                  product.old_price > product.price && (
                    <div className="old-price">
                      ৳{formatPrice(product.old_price)}
                    </div>
                  )}

                <div
                  className={
                    product.stock > 0
                      ? 'stock available'
                      : 'stock unavailable'
                  }
                >
                  স্টক: {product.stock}
                </div>
              </a>

              {/* ADD TO CART */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                className={
                  product.stock > 0
                    ? 'cart-button'
                    : 'cart-button disabled'
                }
              >
                {product.stock > 0
                  ? '🛒 Add to Cart'
                  : 'Out of Stock'}
              </button>

              {/* BUY NOW */}
              {product.stock > 0 && (
                <button
                  onClick={() => {
                    handleAddToCart(product);
                    window.location.href = '/cart';
                  }}
                  className="buy-button"
                >
                  ⚡ Buy Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RESPONSIVE CSS */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .shop-page {
          width: 100%;
          min-height: 100vh;
          background: #f4f4f4;
          padding: 12px;
          overflow-x: hidden;
        }

        /* HERO */
        .hero-banner {
          position: relative;
          width: 100%;
          height: 210px;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 12px;
          background-image: url('/hero-banner.png');
          background-size: cover;
          background-position: center;
        }

        .hero-link {
          position: absolute;
          inset: 0;
          display: block;
          z-index: 2;
        }

        /* VOUCHER */
        .voucher {
          width: 100%;
          background: #fff;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
        }

        .voucher-title {
          font-weight: 700;
          font-size: 13px;
        }

        .voucher-offer {
          color: #f50;
          font-size: 11px;
          margin-top: 3px;
        }

        .collect-button {
          flex-shrink: 0;
          background: #ff4600;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 8px 14px;
          font-weight: 700;
          cursor: pointer;
        }

        /* SPECIAL OFFER */
        .special-offer {
          display: block;
          width: 100%;
          overflow: hidden;
          margin-bottom: 16px;
          border-radius: 999px;
          background: #fff3e0;
          border: 1px solid #ff7043;
          height: 34px;
          text-decoration: none;
          color: #e53935;
          white-space: nowrap;
        }

        .offer-moving {
          display: inline-block;
          padding-left: 100%;
          animation: offerMove 12s linear infinite;
          font-size: 12px;
          font-weight: 800;
          line-height: 34px;
        }

        @keyframes offerMove {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-100%);
          }
        }

        /* CATEGORY */
        .category-section {
          margin-bottom: 20px;
        }

        .section-header,
        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .section-header h2,
        .products-header h2 {
          font-size: 16px;
          margin: 0;
          font-weight: 800;
        }

        .section-header span {
          font-size: 11px;
          color: #777;
          white-space: nowrap;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 7px;
        }

        .category-card {
          min-width: 0;
          text-decoration: none;
          color: #333;
          text-align: center;
          border-radius: 12px;
          padding: 10px 3px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #bdbdbd;
        }

        .category-icon {
          width: 42px;
          height: 42px;
          margin: 0 auto 6px;
          border-radius: 50%;
          background: #fff4e8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .category-name {
          font-size: 10px;
          font-weight: 700;
          line-height: 1.2;
          word-break: break-word;
        }

        /* PRODUCTS HEADER */
        .products-header {
          margin-bottom: 10px;
        }

        .products-header span {
          color: #ff4600;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* MESSAGE */
        .message-box {
          width: 100%;
          background: #fff;
          border-radius: 10px;
          padding: 25px;
          text-align: center;
        }

        /* PRODUCT GRID */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          width: 100%;
        }

        .product-card {
          min-width: 0;
          background: #fff;
          border-radius: 10px;
          padding: 8px;
          color: #212121;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .product-link {
          text-decoration: none;
          color: #212121;
          display: block;
        }

        .product-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          min-height: 0;
          background: #f9f9f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-size: 48px;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .product-tag {
          display: inline-block;
          max-width: 100%;
          margin-top: 6px;
          background: #fff0e6;
          color: #ff4600;
          font-size: 9px;
          font-weight: 700;
          padding: 3px 5px;
          border-radius: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-title {
          font-size: 13px;
          margin: 6px 0;
          font-weight: 600;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 36px;
        }

        .product-price {
          color: #ff4600;
          font-size: 16px;
          font-weight: 800;
        }

        .old-price {
          color: #999;
          font-size: 10px;
          text-decoration: line-through;
          margin-top: 2px;
        }

        .stock {
          font-size: 10px;
          margin-top: 4px;
        }

        .stock.available {
          color: #777;
        }

        .stock.unavailable {
          color: #d32f2f;
        }

        .cart-button,
        .buy-button {
          width: 100%;
          margin-top: 9px;
          padding: 10px 5px;
          border: none;
          border-radius: 7px;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          min-height: 40px;
        }

        .cart-button {
          background: #ff4600;
        }

        .cart-button.disabled {
          background: #999;
          cursor: not-allowed;
        }

        .buy-button {
          margin-top: 8px;
          background: #ff6d00;
        }

        /* TABLET */
        @media (min-width: 600px) {
          .shop-page {
            padding: 18px;
          }

          .hero-banner {
            height: 280px;
          }

          .category-grid {
            gap: 12px;
          }

          .category-card {
            padding: 14px 6px;
          }

          .product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .product-image {
            aspect-ratio: 1 / 1;
          }
        }

        /* DESKTOP */
        @media (min-width: 900px) {
          .shop-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
          }

          .hero-banner {
            height: 350px;
          }

          .product-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }

          .product-card {
            padding: 10px;
          }

          .product-image {
            aspect-ratio: 1 / 1;
          }
        }

        /* VERY SMALL MOBILE */
        @media (max-width: 360px) {
          .shop-page {
            padding: 8px;
          }

          .hero-banner {
            height: 175px;
            border-radius: 11px;
          }

          .voucher {
            padding: 10px;
          }

          .voucher-title {
            font-size: 12px;
          }

          .voucher-offer {
            font-size: 10px;
          }

          .collect-button {
            padding: 7px 10px;
            font-size: 11px;
          }

          .category-grid {
            gap: 4px;
          }

          .category-card {
            padding: 8px 2px;
            border-radius: 9px;
          }

          .category-icon {
            width: 36px;
            height: 36px;
            font-size: 19px;
          }

          .category-name {
            font-size: 9px;
          }

          .product-grid {
            gap: 7px;
          }

          .product-card {
            padding: 6px;
          }

          .product-image {
            border-radius: 8px;
          }

          .product-title {
            font-size: 12px;
          }

          .product-price {
            font-size: 14px;
          }

          .cart-button,
          .buy-button {
            font-size: 11px;
            min-height: 38px;
          }
        }
      `}</style>
    </main>
  );
}
