'use client';

import React, { useState } from 'react';
import { useCart } from '../../components/CartContext';

export default function Checkout() {
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      alert('দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন!');
      return;
    }

    if (cart.length === 0) {
      alert('আপনার Cart খালি। আগে একটি Product Cart-এ যোগ করুন।');
      return;
    }

    setIsOrdered(true);
    clearCart();
  };

  if (cart.length === 0 && !isOrdered) {
    return (
      <div
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
            padding: '40px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>
            🛒
          </div>

          <h1
            style={{
              fontSize: '18px',
              margin: 0,
              color: '#424242',
            }}
          >
            আপনার Cart খালি
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: '#757575',
              marginTop: '8px',
            }}
          >
            Checkout করার আগে একটি Product Cart-এ যোগ করুন।
          </p>

          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '18px',
              backgroundColor: '#ff4600',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  if (isOrdered) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          minHeight: '80vh',
          backgroundColor: '#f4f4f4',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '30px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>
            🎉
          </div>

          <h1
            style={{
              fontSize: '20px',
              color: '#16a34a',
              margin: '0 0 8px',
              fontWeight: 'bold',
            }}
          >
            অর্ডার সফল হয়েছে!
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#424242',
              margin: '0 0 20px',
              lineHeight: '1.5',
            }}
          >
            আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের একজন প্রতিনিধি
            আপনার সাথে যোগাযোগ করবেন।
          </p>

          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              textAlign: 'left',
              color: '#616161',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span>
              <strong>নাম:</strong> {formData.name}
            </span>

            <span>
              <strong>মোবাইল:</strong> {formData.phone}
            </span>

            <span>
              <strong>ঠিকানা:</strong> {formData.address},{' '}
              {formData.city}
            </span>

            <span>
              <strong>পেমেন্ট:</strong>{' '}
              {paymentMethod === 'cod'
                ? 'Cash on Delivery'
                : 'Online Payment'}
            </span>
          </div>

          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              backgroundColor: '#ff4600',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            হোম পেজে ফিরে যান
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
        padding: '12px',
        paddingBottom: '145px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <h1
        style={{
          fontSize: '18px',
          fontWeight: '800',
          margin: '4px 0',
          color: '#212121',
        }}
      >
        Checkout & Shipping
      </h1>

      {/* CART PRODUCTS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '700',
            margin: '0 0 10px',
          }}
        >
          আপনার পণ্য
        </h2>

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                width: '55px',
                height: '55px',
                borderRadius: '7px',
                overflow: 'hidden',
                backgroundColor: '#f8f8f8',
                flexShrink: 0,
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '25px',
                  }}
                >
                  📦
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#212121',
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: '#757575',
                  marginTop: '3px',
                }}
              >
                ৳{item.price} × {item.quantity}
              </div>
            </div>

            <div
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#ff4600',
              }}
            >
              ৳{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* SHIPPING ADDRESS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '700',
              margin: '0 0 4px',
            }}
          >
            ডেলিভারি ঠিকানা
          </h2>

          <input
            type="text"
            placeholder="আপনার নাম"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              fontSize: '13px',
              outline: 'none',
            }}
          />

          <input
            type="tel"
            placeholder="মোবাইল নম্বর"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              fontSize: '13px',
              outline: 'none',
            }}
          />

          <select
            value={formData.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                city: e.target.value,
              })
            }
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              fontSize: '13px',
              backgroundColor: '#ffffff',
            }}
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

          <textarea
            placeholder="সম্পূর্ণ ঠিকানা (গ্রাম/রোড, থানা, জেলা)"
            required
            rows={3}
            value={formData.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              fontSize: '13px',
              fontFamily: 'sans-serif',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        {/* PAYMENT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '700',
              margin: '0 0 8px',
            }}
          >
            পেমেন্ট পদ্ধতি
          </h2>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              border: '1px solid #ff4600',
              borderRadius: '8px',
              backgroundColor: '#fff0e6',
            }}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />

            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                }}
              >
                Cash on Delivery (COD)
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: '#757575',
                  marginTop: '2px',
                }}
              >
                পণ্য হাতে পেয়ে টাকা পরিশোধ করুন
              </div>
            </div>
          </label>
        </div>

        {/* SUMMARY */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: '700',
              margin: '0 0 8px',
            }}
          >
            অর্ডার বিবরণী
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#757575',
            }}
          >
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#757575',
              marginTop: '6px',
            }}
          >
            <span>Delivery Fee</span>
            <span>৳{deliveryFee}</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              fontWeight: '700',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #eeeeee',
            }}
          >
            <span>Total Payable</span>

            <span style={{ color: '#ff4600' }}>
              ৳{total}
            </span>
          </div>
        </div>

        {/* PLACE ORDER */}
        <div
          style={{
            position: 'fixed',
            bottom: '60px',
            left: 0,
            zIndex: 90,
            minHeight: '60px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e0e0e0',
            padding: '8px 12px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 -4px 10px rgba(0,0,0,0.06)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                color: '#757575',
              }}
            >
              Total
            </div>

            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#ff4600',
              }}
            >
              ৳{total}
            </div>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#ff4600',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 28px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
