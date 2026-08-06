'use client';

import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      padding: '12px', 
      boxSizing: 'border-box', 
      backgroundColor: '#f4f4f4',
      width: '100%'
    }}>
      
      {/* ==================== HERO BANNER ==================== */}
      <div style={{ background: 'linear-gradient(135deg, #f50 0%, #ff85c0 100%)', borderRadius: '12px', padding: '20px', color: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, lineHeight: '1.3' }}>সবচেয়ে কম দামে <br />সেরা কেনাকাটা!</h1>
        <p style={{ fontSize: '11px', color: '#fff5f5', margin: '4px 0 0 0' }}>Friends Shop-এ পাচ্ছেন ফ্রি শিপিং ও অফার।</p>
      </div>

      {/* ==================== VOUCHER / COUPON BAR ==================== */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#212121' }}>Claim Vouchers to Save More!</span>
          <span style={{ fontSize: '11px', color: '#f50' }}>৳৪০ Free Shipping • ৫% OFF</span>
        </div>
        <button style={{ backgroundColor: '#ff4600', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '11px', fontWeight: 'bold' }}>Collect</button>
      </div>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#212121' }}>ক্যাটাগরি সমূহ</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          {/* Category 1 */}
          <a href="/category/fashion" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <div style={{ height: '40px', width: '40px', backgroundColor: '#fff1f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👕</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#424242' }}>Fashion</span>
          </a>
          {/* Category 2 */}
          <a href="/category/gadgets" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <div style={{ height: '40px', width: '40px', backgroundColor: '#e6f7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📱</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#424242' }}>Gadgets</span>
          </a>
          {/* Category 3 */}
          <a href="/category/mart" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <div style={{ height: '40px', width: '40px', backgroundColor: '#f6ffed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🍏</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#424242' }}>Mart</span>
          </a>
          {/* Category 4 */}
          <a href="/category/beauty" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            <div style={{ height: '40px', width: '40px', backgroundColor: '#fff0f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💄</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#424242' }}>Beauty</span>
          </a>
        </div>
      </div>

      {/* ==================== FLASH SALE (HORIZONTAL SCROLL) ==================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#212121' }}>Fl⚡sh Sale</h2>
            <span style={{ backgroundColor: '#ff4600', color: '#ffffff', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>01:24:55</span>
          </div>
          <a href="/flash-sale" style={{ fontSize: '12px', fontWeight: '600', color: '#ff4600', textDecoration: 'none' }}>More &gt;</a>
        </div>
        
        {/* আড়াআড়ি স্ক্রোলার */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
          {/* Flash Item 1 */}
          <div style={{ flex: '0 0 100px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#faf8f5', height: '80px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>🎒</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff4600' }}>৳১২০</span>
            <span style={{ fontSize: '9px', color: '#9e9e9e', textDecoration: 'line-through' }}>৳৩২৪</span>
          </div>
          {/* Flash Item 2 */}
          <div style={{ flex: '0 0 100px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#faf8f5', height: '80px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>📿</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff4600' }}>৳৮৯</span>
            <span style={{ fontSize: '9px', color: '#9e9e9e', textDecoration: 'line-through' }}>৳২৯৬</span>
          </div>
          {/* Flash Item 3 */}
          <div style={{ flex: '0 0 100px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ backgroundColor: '#faf8f5', height: '80px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>👟</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff4600' }}>৳৭৫০</span>
            <span style={{ fontSize: '9px', color: '#9e9e9e', textDecoration: 'line-through' }}>৳১৫০০</span>
          </div>
        </div>
      </div>

      {/* ==================== DAILY SHERA DEALS (২-কলাম গ্রিড) ==================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#212121' }}>Daily Shera Deals</h2>
        
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          {/* প্রোডাক্ট ১ */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ backgroundColor: '#f9f9f9', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' }}>🎧</div>
            <span style={{ backgroundColor: '#fff0e6', color: '#ff4600', fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '3px', alignSelf: 'flex-start' }}>Free Gift 🎁</span>
            <h3 style={{ fontSize: '12px', color: '#212121', margin: 0, fontWeight: '500' }}>Wireless Headphone</h3>
            <span style={{ fontSize: '14px', color: '#ff4600', fontWeight: 'bold' }}>৳১২৫০</span>
          </div>

          {/* প্রোডাক্ট ২ */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ backgroundColor: '#f9f9f9', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' }}>⌚</div>
            <span style={{ backgroundColor: '#fff0e6', color: '#ff4600', fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '3px', alignSelf: 'flex-start' }}>Free Shipping 🚚</span>
            <h3 style={{ fontSize: '12px', color: '#212121', margin: 0, fontWeight: '500' }}>Luxury Men Watch</h3>
            <span style={{ fontSize: '14px', color: '#ff4600', fontWeight: 'bold' }}>৳১৮৫০</span>
          </div>
        </div>
      </div>

    </div>
  );
}
