'use client';

import React, { useState } from 'react';

export default function Checkout() {
  // ফর্ম স্টেট হ্যান্ডেল করার জন্য
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // ডিফল্ট Cash on Delivery
  const [isOrdered, setIsOrdered] = useState(false);

  // ডামি প্রাইস ক্যালকুলেশন (কার্ট থেকে আসা হিসাব)
  const subtotal = 3100;
  const deliveryFee = 60;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন!');
      return;
    }
    setIsOrdered(true);
  };

  if (isOrdered) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px 20px', textAlign: 'center', minHeight: '80vh', backgroundColor: '#f4f4f4' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>🎉</div>
          <h1 style={{ fontSize: '20px', color: '#16a34a', margin: '0 0 8px 0', fontWeight: 'bold' }}>অর্ডার সফল হয়েছে!</h1>
          <p style={{ fontSize: '14px', color: '#424242', margin: '0 0 20px 0', lineHeight: '1.4' }}>আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের একজন প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।</p>
          <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'left', color: '#616161', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span><strong>নাম:</strong> {formData.name}</span>
            <span><strong>মোবাইল:</strong> {formData.phone}</span>
            <span><strong>ঠিকানা:</strong> {formData.address}, {formData.city}</span>
            <span><strong>মোট মূল্য:</strong> ৳{total}</span>
            <span><strong>পেমেন্ট পদ্ধতি:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery (ক্যাশ অন ডেলিভারি)' : 'Online Payment'}</span>
          </div>
          <a href="/" style={{ display: 'inline-block', marginTop: '20px', backgroundColor: '#ff4600', color: '#ffffff', textDecoration: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>হোম পেজে ফিরে যান</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px', 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh',
      paddingBottom: '80px',
      boxSizing: 'border-box',
      width: '100%',
      padding: '12px'
    }}>
      
      <h1 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 4px 0', color: '#212121' }}>
        Checkout & Shipping
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* ==================== SHIPPING ADDRESS FORM ==================== */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0', color: '#212121' }}>ডেলিভারি ঠিকানা (Shipping Address)</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#757575', fontWeight: '600' }}>আপনার নাম</label>
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#757575', fontWeight: '600' }}>মোবাইল নম্বর</label>
            <input 
              type="tel" 
              placeholder="01XXXXXXXXX" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#757575', fontWeight: '600' }}>শহর / বিভাগ</label>
            <select 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', backgroundColor: '#ffffff', outline: 'none' }}
            >
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Khulna">Khulna</option>
              <option value="Barisal">Barisal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#757575', fontWeight: '600' }}>সম্পূর্ণ ঠিকানা (গ্রাম/রোড, থানা, জেলা)</label>
            <textarea 
              placeholder="House/Road No, Village, Thana" 
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none', resize: 'none' }}
            />
          </div>
        </div>

        {/* ==================== PAYMENT METHOD ==================== */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0', color: '#212121' }}>পেমেন্ট পদ্ধতি (Payment Method)</h2>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ff4600', borderRadius: '8px', backgroundColor: '#fff0e6', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="payment" 
              value="cod" 
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              style={{ accentColor: '#ff4600' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#212121' }}>Cash on Delivery (COD)</span>
              <span style={{ fontSize: '11px', color: '#757575' }}>পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</span>
            </div>
          </label>
        </div>

        {/* ==================== ORDER SUMMARY ==================== */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0', color: '#212121' }}>অর্ডার বিবরণী</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#757575' }}>
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#757575', borderBottom: '1px solid #f5f5f5', paddingBottom: '6px' }}>
            <span>Delivery Fee</span>
            <span>৳{deliveryFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', color: '#212121', paddingTop: '4px' }}>
            <span>Total Payable</span>
            <span style={{ color: '#ff4600' }}>৳{total}</span>
          </div>
        </div>

        {/* ==================== FIXED PLACE ORDER BAR ==================== */}
        <div style={{
          position: 'fixed',
          bottom: '56px',
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
          
          <button type="submit" style={{
            backgroundColor: '#ff4600',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 32px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(255,70,0,0.2)'
          }}>
            Place Order
          </button>
        </div>

      </form>
    </div>
  );
}
