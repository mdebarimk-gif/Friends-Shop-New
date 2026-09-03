'use client';

import React, { useState } from 'react';

export default function ShoppingCart() {
  // ডামি কার্ট আইটেম ডেটা (কাস্টমার হেডফোন এবং ঘড়ি কার্টে যোগ করেছে)
  const [cartItems, setCartItems] = useState([
    { id: 1, title: 'Premium Wireless Headphone', image: '🎧', price: 1250, quantity: 1, tag: 'Free Gift 🎁' },
    { id: 2, title: 'Men Luxury Sports Watch', image: '⌚', price: 1850, quantity: 1, tag: 'Free Shipping 🚚' },
  ]);

  // কোয়ান্টিটি বাড়ানোর ফাংশন
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  // আইটেম রিমুভ করার ফাংশন
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // সাবটোটাল বা মোট হিসাব ক্যালকুলেশন
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px', 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh',
      paddingBottom: '80px', // ফিক্সড চেকআউট বারের জন্য নিচের স্পেস
      boxSizing: 'border-box',
      width: '100%',
      padding: '12px'
    }}>
      
      <h1 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 8px 0', color: '#212121' }}>
        Shopping Cart ({cartItems.length} Items)
      </h1>

      {cartItems.length === 0 ? (
        /* কার্ট খালি থাকলে এই মেসেজ দেখাবে */
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>🛒</div>
          <h2 style={{ fontSize: '16px', color: '#757575', margin: 0 }}>Your cart is empty!</h2>
          <a href="/" style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#ff4600', color: '#ffffff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Continue Shopping</a>
        </div>
      ) : (
        <>
          {/* ==================== CART ITEMS LIST ==================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cartItems.map((item) => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  position: 'relative',
                  boxSizing: 'border-box'
                }}
              >
                {/* প্রোডাক্ট ইমেজ */}
                <div style={{ backgroundColor: '#f9f9f9', width: '80px', height: '80px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                  {item.image}
                </div>

                {/* প্রোডাক্ট কন্টেন্ট */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '13px', color: '#212121', margin: 0, fontWeight: '500', paddingRight: '20px', lineHeight: '1.3' }}>
                      {item.title}
                    </h3>
                    <span style={{ color: '#ff4600', fontSize: '9px', fontWeight: 'bold', backgroundColor: '#fff0e6', padding: '1px 6px', borderRadius: '3px', display: 'inline-block', marginTop: '2px' }}>
                      {item.tag}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#ff4600' }}>৳{item.price * item.quantity}</span>
                    
                    {/* প্লাস-মাইনাস কাউন্টার */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', backgroundColor: '#f5f5f5', padding: '4px 10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                      <span style={{ padding: '0 10px', fontSize: '12px', fontWeight: 'bold', color: '#212121' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', backgroundColor: '#f5f5f5', padding: '4px 10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                </div>

                {/* রিমুভ / ডিলিট বাটন */}
                <button 
                  onClick={() => removeItem(item.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', backgroundColor: 'transparent', color: '#9e9e9e', fontSize: '16px', cursor: 'pointer', padding: 0 }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          {/* ==================== ORDER SUMMARY ==================== */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginTop: '4px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0', color: '#212121' }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#757575' }}>
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#757575', borderBottom: '1px solid #f5f5f5', paddingBottom: '8px' }}>
              <span>Delivery Fee</span>
              <span>৳{deliveryFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', color: '#212121', paddingTop: '4px' }}>
              <span>Total Amount</span>
              <span style={{ color: '#ff4600' }}>৳{total}</span>
            </div>
          </div>
        </>
      )}

      {/* ==================== FIXED CHECKOUT BAR ==================== */}
      {cartItems.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '56px', // বটম নেভিগেশন বারের ঠিক ওপরে বসার জন্য
          left: 0,
          zIndex: 90,
          height: '60px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          padding: '8px 12px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: '#757575' }}>Total:</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff4600' }}>৳{total}</span>
          </div>
          
          <button style={{
            backgroundColor: '#ff4600', // দারাজ অরেঞ্জ থিম
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(255,70,0,0.2)'
          }}>
            Proceed to Checkout
          </button>
        </div>
      )}

    </div>
  );
}