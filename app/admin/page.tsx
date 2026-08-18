'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '12px',
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
            fontSize: '20px',
            fontWeight: '800',
            color: '#212121',
          }}
        >
          Admin Dashboard
        </h1>

        <p
          style={{
            margin: '5px 0 0',
            fontSize: '12px',
            color: '#757575',
          }}
        >
          Friends Shop Control Panel
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        <a
          href="/admin/add-product"
          style={{
            backgroundColor: '#ff4600',
            color: '#ffffff',
            textDecoration: 'none',
            textAlign: 'center',
            padding: '14px 8px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          ➕ Add Product
        </a>

        <a
          href="/"
          style={{
            backgroundColor: '#212121',
            color: '#ffffff',
            textDecoration: 'none',
            textAlign: 'center',
            padding: '14px 8px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          🏠 View Shop
        </a>
      </div>
    </div>
  );
}
