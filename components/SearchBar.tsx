'use client';

import React, { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const value = query.trim();

    if (value) {
      window.location.href = `/search?q=${encodeURIComponent(value)}`;
    } else {
      window.location.href = '/search';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: '38px',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '22px',
          padding: '0 12px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '18px', marginRight: '7px' }}>
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search in Friends Shop..."
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            color: '#222',
          }}
        />
      </div>

      <button
        type="button"
        onClick={handleSearch}
        style={{
          height: '38px',
          padding: '0 15px',
          border: 'none',
          borderRadius: '22px',
          backgroundColor: '#ffffff',
          color: '#ff4600',
          fontSize: '13px',
          fontWeight: '800',
        }}
      >
        Search
      </button>
    </div>
  );
}
