'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../../components/CartContext';

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

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setLoading(true);
      setError('');

      const productId = Number(id);

      if (!Number.isInteger(productId)) {
        setError('পণ্যের ID সঠিক নয়।');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Product load error:', error);
        setError('পণ্যটি খুঁজে পাওয়া যায়নি।');
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#f4f4f4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '35px' }}>⏳</div>

          <p
            style={{
              margin: '10px 0 0',
              fontWeight: '700',
              color: '#212121',
            }}
          >
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !product) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#f4f4f4',
          padding: '30px 15px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '30px 15px',
          }}
        >
          <div style={{ fontSize: '50px' }}>😕</div>

          <h1
            style={{
              fontSize: '18px',
              margin: '10px 0',
              color: '#212121',
            }}
          >
            {error || 'পণ্য পাওয়া যায়নি'}
          </h1>

          <button
            onClick={() => router.push('/')}
            style={{
              marginTop: '10px',
              backgroundColor: '#ff4600',
              color: '#ffffff',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            🏠 Shop-এ ফিরে যান
          </button>
        </div>
      </main>
    );
  }

  // =========================
  // DISCOUNT
  // =========================

  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round(
          ((product.old_price - product.price) /
            product.old_price) *
            100
        )
      : 0;

  // =========================
  // STOCK
  // =========================

  const stockText =
    product.stock > 0
      ? product.stock <= 5
        ? `In Stock (Only ${product.stock} left)`
        : `In Stock (${product.stock})`
      : 'Out of Stock';

  const outOfStock = product.stock <= 0;

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    if (outOfStock) {
      alert('এই পণ্যটি বর্তমানে Stock-এ নেই।');
      return;
    }

    setAdding(true);

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image_url || '',
      });
    }

    setTimeout(() => {
      setAdding(false);
      alert(`🛒 ${quantity}টি পণ্য Cart-এ যোগ হয়েছে।`);
    }, 300);
  };

  // =========================
  // BUY NOW
  // =========================

  const handleBuyNow = () => {
    if (outOfStock) {
      alert('এই পণ্যটি বর্তমানে Stock-এ নেই।');
      return;
    }

    setBuying(true);

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image_url || '',
      });
    }

    setTimeout(() => {
      router.push('/checkout');
    }, 300);
  };

  // =========================
  // QUANTITY
  // =========================

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const increaseQuantity = () => {
    if (product.stock <= 0) return;

    setQuantity((q) =>
      Math.min(product.stock, q + 1)
    );
  };

  // =========================
  // TOTAL PRICE
  // =========================

  const totalPrice = product.price * quantity;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
        paddingBottom: '85px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <div
        style={{
          backgroundColor: '#ffffff',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px',
          boxSizing: 'border-box',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '280px',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '80px',
            }}
          >
            🛍️
          </div>
        )}
      </div>

      {/* =========================
          PRICE & TITLE
      ========================= */}

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ff4600',
            }}
          >
            ৳{product.price}
          </span>

          {product.old_price &&
            product.old_price > product.price && (
              <>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#9e9e9e',
                    textDecoration: 'line-through',
                  }}
                >
                  ৳{product.old_price}
                </span>

                <span
                  style={{
                    fontSize: '12px',
                    color: '#ff4600',
                    fontWeight: 'bold',
                    backgroundColor: '#fff0e6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  -{discount}% OFF
                </span>
              </>
            )}
        </div>

        <h1
          style={{
            fontSize: '17px',
            fontWeight: '600',
            color: '#212121',
            margin: 0,
            lineHeight: '1.5',
          }}
        >
          {product.title}
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#757575',
            borderTop: '1px solid #f5f5f5',
            paddingTop: '8px',
            marginTop: '4px',
            flexWrap: 'wrap',
          }}
        >
          <span>⭐ 5.0</span>

          <span>•</span>

          <span
            style={{
              color: outOfStock ? '#d32f2f' : '#2ec4b6',
              fontWeight: 'bold',
            }}
          >
            {stockText}
          </span>

          {product.category && (
            <>
              <span>•</span>
              <span>{product.category}</span>
            </>
          )}
        </div>

        {product.tag && (
          <div
            style={{
              display: 'inline-block',
              width: 'fit-content',
              backgroundColor: '#fff0e6',
              color: '#ff4600',
              padding: '5px 8px',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: '700',
            }}
          >
            {product.tag}
          </div>
        )}
      </div>

      {/* =========================
          QUANTITY
      ========================= */}

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#212121',
            }}
          >
            Quantity
          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#757575',
              marginTop: '3px',
            }}
          >
            মোট: ৳{totalPrice}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={decreaseQuantity}
            style={{
              border: 'none',
              backgroundColor: '#f5f5f5',
              padding: '6px 14px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            -
          </button>

          <span
            style={{
              padding: '0 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#212121',
              minWidth: '20px',
              textAlign: 'center',
            }}
          >
            {quantity}
          </span>

          <button
            onClick={increaseQuantity}
            disabled={outOfStock || quantity >= product.stock}
            style={{
              border: 'none',
              backgroundColor: '#f5f5f5',
              padding: '6px 14px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor:
                !outOfStock && quantity < product.stock
                  ? 'pointer'
                  : 'not-allowed',
              opacity:
                !outOfStock && quantity < product.stock
                  ? 1
                  : 0.5,
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* =========================
          DESCRIPTION
      ========================= */}

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '700',
            margin: 0,
            color: '#212121',
          }}
        >
          Product Specifications
        </h2>

        <p
          style={{
            fontSize: '12px',
            color: '#424242',
            margin: 0,
            lineHeight: '1.7',
            textAlign: 'justify',
            whiteSpace: 'pre-wrap',
          }}
        >
          {product.description ||
            'এই পণ্যের কোনো বিবরণ দেওয়া হয়নি।'}
        </p>

        <div
          style={{
            fontSize: '11px',
            color: '#757575',
            marginTop: '6px',
            backgroundColor: '#f9f9f9',
            padding: '8px',
            borderRadius: '6px',
          }}
        >
          🏪 Store: Friends Shop
        </div>
      </div>

      {/* =========================
          FIXED BOTTOM BUTTONS
      ========================= */}

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 100,
          minHeight: '60px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          padding: '8px 12px',
          boxSizing: 'border-box',
          display: 'flex',
          gap: '8px',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* CHAT */}

        <button
          onClick={() => alert('Customer support শীঘ্রই চালু হবে।')}
          style={{
            backgroundColor: '#fff0e6',
            border: 'none',
            borderRadius: '8px',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          💬
        </button>

        {/* ADD TO CART */}

        <button
          onClick={handleAddToCart}
          disabled={outOfStock || adding || buying}
          style={{
            flex: 1,
            backgroundColor:
              outOfStock || adding ? '#999' : '#ff5500',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor:
              outOfStock || adding
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          {adding ? 'যোগ হচ্ছে...' : 'Add to Cart'}
        </button>

        {/* BUY NOW */}

        <button
          onClick={handleBuyNow}
          disabled={outOfStock || adding || buying}
          style={{
            flex: 1,
            backgroundColor:
              outOfStock || buying ? '#999' : '#ff1447',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor:
              outOfStock || buying
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          {buying ? 'অপেক্ষা করুন...' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}
