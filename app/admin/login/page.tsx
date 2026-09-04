'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace('/admin');
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('দয়া করে ইমেইল ও পাসওয়ার্ড দিন।');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage('❌ ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
      return;
    }

    setMessage('✅ Login সফল হয়েছে।');

    router.replace('/admin');
  };

  return (
    <main
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '24px 20px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ff4600',
              margin: 0,
            }}
          >
            Friends<span style={{ color: '#212121' }}>Shop</span>
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: '#757575',
              marginTop: '6px',
            }}
          >
            Admin Login
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div>
            <label
              style={{
                fontSize: '12px',
                color: '#616161',
                fontWeight: '600',
              }}
            >
              ইমেইল অ্যাড্রেস
            </label>

            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '12px',
                color: '#616161',
                fontWeight: '600',
              }}
            >
              পাসওয়ার্ড
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {message && (
            <div
              style={{
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: message.startsWith('✅')
                  ? '#e8f5e9'
                  : '#ffebee',
                color: message.startsWith('✅')
                  ? '#2e7d32'
                  : '#c62828',
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#999' : '#ff4600',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '13px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : '🔐 Login'}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: '5px',
  padding: '12px',
  boxSizing: 'border-box',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: '13px',
  outline: 'none',
  backgroundColor: '#fff',
};
