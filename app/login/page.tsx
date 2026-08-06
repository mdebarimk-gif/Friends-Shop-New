'use client';

import React, { useState } from 'react';

export default function Login() {
  // true = Login Mode, false = Register/Sign Up Mode
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // ফর্ম ডেটা স্টেট
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoginMode) {
      // লগইন লজিক টেস্ট
      if (!email || !password) {
        alert('দয়া করে ইমেইল এবং পাসওয়ার্ড দিন!');
        return;
      }
      alert(`সফলভাবে লগইন হয়েছে!\nইমেইল: ${email}`);
    } else {
      // রেজিস্ট্রেশন লজিক টেস্ট
      if (!name || !email || !password) {
        alert('দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন!');
        return;
      }
      alert(`অ্যাকাউন্ট তৈরি সফল হয়েছে!\nনাম: ${name}\nইমেইল: ${email}`);
      setIsLoginMode(true); // অ্যাকাউন্ট খোলার পর লগইন মোডে নিয়ে যাওয়া
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh', 
      backgroundColor: '#f4f4f4',
      padding: '16px',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      
      {/* ==================== AUTH CONTAINER ==================== */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px 20px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        
        {/* Title & Brand */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4600', margin: 0 }}>
            Friends<span style={{ color: '#212121' }}>Shop</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#757575', margin: '4px 0 0 0' }}>
            {isLoginMode ? 'Welcome back! Please login to your account' : 'Create a new account to start shopping'}
          </p>
        </div>

        {/* Form Start */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Name Field (Only visible in Register Mode) */}
          {!isLoginMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>আপনার নাম</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
              />
            </div>
          )}

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>ইমেইল অ্যাড্রেস</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
            />
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', color: '#616161', fontWeight: '600' }}>পাসওয়ার্ড</label>
              {isLoginMode && (
                <a href="#forgot" style={{ fontSize: '11px', color: '#ff4600', textDecoration: 'none' }}>Forgot?</a>
              )}
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '13px', outline: 'none' }}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" style={{
            backgroundColor: '#ff4600',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginTop: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(255,70,0,0.15)',
            transition: 'background-color 0.2s'
          }}>
            {isLoginMode ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Mode Link */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#616161', marginTop: '4px' }}>
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLoginMode(!isLoginMode)}
            style={{ color: '#ff4600', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLoginMode ? 'Register Now' : 'Login Here'}
          </span>
        </div>

      </div>
    </div>
  );
}