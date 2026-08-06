'use client';

import React from 'react';

export default function AdminDashboard() {
  // ডামি এডমিন স্ট্যাটিস্টিকস ডেটা (সেলস রিপোর্ট সামারি)
  const reportSummary = {
    totalSales: '৪,৫২,৩০০',
    totalOrders: '১২৪',
    lowStockItems: '৩',
    totalCustomers: '৮৬'
  };

  // সাম্প্রতিক অর্ডারের তালিকা
  const recentOrders = [
    { id: 'ORD-9932', customer: 'রাকিব হাসান', total: '৳১২৫০', status: 'Pending', statusColor: '#ff9800' },
    { id: 'ORD-9931', customer: 'আরিফ আহমেদ', total: '৳১৮৫০', status: 'Shipped', statusColor: '#2196f3' },
    { id: 'ORD-9930', customer: 'ফাতেমা বেগম', total: '৳৯৯০', status: 'Delivered', statusColor: '#4caf50' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh',
      padding: '12px',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      
      {/* ==================== DASHBOARD HEADER ==================== */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#212121' }}>Admin Dashboard</h1>
          <span style={{ fontSize: '11px', color: '#757575' }}>কন্ট্রোল প্যানেল ও সেলস রিপোর্ট</span>
        </div>
        <span style={{ backgroundColor: '#ff4600', color: '#ffffff', fontSize: '10px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Live 🟢</span>
      </div>

      {/* ==================== QUICK ACCORDION / QUICK LINKS ==================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <button style={{ backgroundColor: '#ff4600', color: '#ffffff', border: 'none', padding: '12px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>➕ Add Product</button>
        <button style={{ backgroundColor: '#212121', color: '#ffffff', border: 'none', padding: '12px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📦 Order List</button>
      </div>

      {/* ==================== STATS REPORT CARDS (2-COLUMN GRID) ==================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        width: '100%'
      }}>
        {/* Card 1: Total Sales */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '20px' }}>💰</span>
          <span style={{ fontSize: '11px', color: '#757575', fontWeight: '500' }}>মোট বিক্রি (Sales)</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff4600' }}>৳{reportSummary.totalSales}</span>
        </div>

        {/* Card 2: Total Orders */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '20px' }}>📦</span>
          <span style={{ fontSize: '11px', color: '#757575', fontWeight: '500' }}>মোট অর্ডার (Orders)</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#212121' }}>{reportSummary.totalOrders} টি</span>
        </div>

        {/* Card 3: Total Customers */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '20px' }}>👥</span>
          <span style={{ fontSize: '11px', color: '#757575', fontWeight: '500' }}>গ্রাহক সংখ্যা (Users)</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#212121' }}>{reportSummary.totalCustomers} জন</span>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #ffccc7' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span style={{ fontSize: '11px', color: '#ff4d4f', fontWeight: '600' }}>স্টক অ্যালার্ট (Low Stock)</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff4d4f' }}>{reportSummary.lowStockItems} টি আইটেম</span>
        </div>
      </div>

      {/* ==================== RECENT ORDERS LIST ==================== */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#212121' }}>সাম্প্রতিক অর্ডার সমূহ (Recent Orders)</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentOrders.map((order) => (
            <div 
              key={order.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f5f5f5',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 'bold', color: '#212121' }}>{order.id}</span>
                <span style={{ color: '#757575' }}>{order.customer}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#ff4600' }}>{order.total}</span>
                <span style={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  backgroundColor: order.statusColor, 
                  padding: '1px 6px', 
                  borderRadius: '3px' 
                }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}