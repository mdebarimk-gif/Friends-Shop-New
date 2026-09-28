'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

type Voucher = {
  id: number;
  code: string;
  title: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  active: boolean;
  expires_at: string | null;
};

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    code: '',
    title: '',
    discountType: 'percent',
    discountValue: '',
    minOrder: '',
    maxDiscount: '',
    expiresAt: '',
  });

  const loadVouchers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      setMessage('❌ Voucher লোড করা যায়নি।');
    } else {
      setVouchers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const addVoucher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code || !form.title || !form.discountValue) {
      setMessage('❌ Code, Title এবং Discount প্রয়োজন।');
      return;
    }

    const { error } = await supabase.from('vouchers').insert({
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      discount_type: form.discountType,
      discount_value: Number(form.discountValue),
      min_order_amount: form.minOrder ? Number(form.minOrder) : 0,
      max_discount: form.maxDiscount
        ? Number(form.maxDiscount)
        : null,
      active: true,
      expires_at: form.expiresAt
        ? new Date(form.expiresAt).toISOString()
        : null,
    });

    if (error) {
      console.error(error);
      setMessage(`❌ Voucher তৈরি হয়নি: ${error.message}`);
      return;
    }

    setMessage('✅ Voucher সফলভাবে তৈরি হয়েছে।');

    setForm({
      code: '',
      title: '',
      discountType: 'percent',
      discountValue: '',
      minOrder: '',
      maxDiscount: '',
      expiresAt: '',
    });

    await loadVouchers();
  };

  const toggleVoucher = async (voucher: Voucher) => {
    const { error } = await supabase
      .from('vouchers')
      .update({ active: !voucher.active })
      .eq('id', voucher.id);

    if (error) {
      setMessage(`❌ Status পরিবর্তন হয়নি: ${error.message}`);
      return;
    }

    setMessage('✅ Voucher status পরিবর্তন হয়েছে।');
    await loadVouchers();
  };

  const deleteVoucher = async (voucher: Voucher) => {
    const confirmed = window.confirm(
      `"${voucher.code}" Voucher-টি Delete করতে চান?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', voucher.id);

    if (error) {
      setMessage(`❌ Delete হয়নি: ${error.message}`);
      return;
    }

    setMessage('✅ Voucher Delete হয়েছে।');
    await loadVouchers();
  };

  return (
    <main
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
          borderRadius: '12px',
          padding: '16px',
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
          🎟️ Voucher Management
        </h1>

        <p
          style={{
            margin: '5px 0 0',
            fontSize: '12px',
            color: '#757575',
          }}
        >
          এখান থেকে Voucher তৈরি ও পরিচালনা করুন
        </p>
      </div>

      {message && (
        <div
          style={{
            backgroundColor: message.startsWith('✅')
              ? '#e8f5e9'
              : '#ffebee',
            color: message.startsWith('✅')
              ? '#2e7d32'
              : '#c62828',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={addVoucher}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
        }}
      >
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: '15px',
            fontWeight: '800',
          }}
        >
          ➕ Create Voucher
        </h2>

        {[
          ['Voucher Code', 'code', 'FRIENDS40'],
          ['Voucher Title', 'title', '৳৪০ Free Shipping • ৫% OFF'],
          ['Discount Value', 'discountValue', '5'],
          ['Minimum Order', 'minOrder', '500'],
          ['Maximum Discount', 'maxDiscount', '40'],
        ].map(([label, key, placeholder]) => (
          <div key={key} style={{ marginBottom: '10px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {label}
            </label>

            <input
              value={form[key as keyof typeof form]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: e.target.value,
                })
              }
              placeholder={placeholder}
              style={{
                width: '100%',
                padding: '11px',
                border: '1px solid #dddddd',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontSize: '13px',
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '10px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '5px',
            }}
          >
            Discount Type
          </label>

          <select
            value={form.discountType}
            onChange={(e) =>
              setForm({
                ...form,
                discountType: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: '11px',
              border: '1px solid #dddddd',
              borderRadius: '8px',
              fontSize: '13px',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount (৳)</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '5px',
            }}
          >
            Expiry Date
          </label>

          <input
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) =>
              setForm({
                ...form,
                expiresAt: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: '11px',
              border: '1px solid #dddddd',
              borderRadius: '8px',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            border: 'none',
            backgroundColor: '#ff4600',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '9px',
            fontSize: '14px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          🎟️ Create Voucher
        </button>
      </form>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: '15px',
            fontWeight: '800',
          }}
        >
          📋 All Vouchers
        </h2>

        {loading ? (
          <p style={{ fontSize: '13px', color: '#757575' }}>
            Voucher লোড হচ্ছে...
          </p>
        ) : vouchers.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#757575' }}>
            কোনো Voucher নেই।
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                style={{
                  border: '1px solid #eeeeee',
                  borderRadius: '10px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '15px',
                      color: '#ff4600',
                    }}
                  >
                    {voucher.code}
                  </strong>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: voucher.active
                        ? '#2e7d32'
                        : '#d32f2f',
                    }}
                  >
                    {voucher.active ? '● Active' : '● Inactive'}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '12px',
                    color: '#424242',
                  }}
                >
                  {voucher.title}
                </div>

                <div
                  style={{
                    marginTop: '6px',
                    fontSize: '11px',
                    color: '#757575',
                  }}
                >
                  Discount: {voucher.discount_value}
                  {voucher.discount_type === 'percent' ? '%' : '৳'}
                  {' • '}
                  Min Order: ৳{voucher.min_order_amount}
                  {voucher.max_discount !== null &&
                    ` • Max: ৳${voucher.max_discount}`}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '10px',
                  }}
                >
                  <button
                    onClick={() => toggleVoucher(voucher)}
                    style={{
                      flex: 1,
                      border: '1px solid #dddddd',
                      backgroundColor: '#ffffff',
                      padding: '8px',
                      borderRadius: '7px',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}
                  >
                    {voucher.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => deleteVoucher(voucher)}
                    style={{
                      flex: 1,
                      border: 'none',
                      backgroundColor: '#ffebee',
                      color: '#d32f2f',
                      padding: '8px',
                      borderRadius: '7px',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <a
        href="/admin"
        style={{
          display: 'block',
          marginTop: '12px',
          textAlign: 'center',
          backgroundColor: '#212121',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '12px',
          borderRadius: '9px',
          fontSize: '13px',
          fontWeight: '700',
        }}
      >
        ← Back to Admin
      </a>
    </main>
  );
}
