'use client';

import React from 'react';
import { useCart } from '../../components/CartContext';

export default function ShoppingCart() {
  const { cart, removeFromCart, addToCart } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  const decreaseQuantity = (id: number) => {
    const item = cart.find((product) => product.id === id);

    if (!item) return;

    if (item.quantity <= 1) {
      removeFromCart(id);
      return;
    }

    // CartContext-এ সরাসরি quantity কমানোর function নেই।
    // তাই একটি item remove করে বাকি quantity আবার যোগ করা হচ্ছে।
    removeFromCart(id);

    for (let i = 0; i < item.quantity - 1; i++) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    }
  };

  const increaseQuantity = (id: number) => {
    const item = cart.find((product) => product.id === id);

    if (!item) return;

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

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
          margin: '4px 0 8px',
          color: '#212121',
        }}
      >
        Shopping Cart ({cart.length} Items)
      </h1>

      {cart.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>
            🛒
          </div>

          <h2
            style={{
              fontSize: '16px',
              color: '#757575',
              margin: 0,
            }}
          >
            Your cart is empty!
          </h2>

          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              backgroundColor: '#ff4600',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {cart.map((item) => (
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
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f9f9f9',
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
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
                    <span style={{ fontSize: '40px' }}>📦</span>
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    justifyContent: 'space-between',
                    minWidth: 0,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '13px',
                      color: '#212121',
                      margin: 0,
                      fontWeight: '600',
                      paddingRight: '25px',
                      lineHeight: '1.3',
                    }}
                  >
                    {item.name}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: '#ff4600',
                      }}
                    >
                      ৳{item.price * item.quantity}
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #e0e0e0',
                        borderRadius: '5px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        style={{
                          border: 'none',
                          backgroundColor: '#f5f5f5',
                          padding: '5px 10px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        −
                      </button>

                      <span
                        style={{
                          padding: '0 10px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#212121',
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        style={{
                          border: 'none',
                          backgroundColor: '#f5f5f5',
                          padding: '5px 10px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove product"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#9e9e9e',
                    fontSize: '15px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <h2
              style={{
                fontSize: '14px',
                fontWeight: '700',
                margin: '0 0 4px',
                color: '#212121',
              }}
            >
              Order Summary
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
                borderBottom: '1px solid #f5f5f5',
                paddingBottom: '8px',
              }}
            >
              <span>Delivery Fee</span>
              <span>৳{deliveryFee}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: '700',
                color: '#212121',
                paddingTop: '4px',
              }}
            >
              <span>Total Amount</span>
              <span style={{ color: '#ff4600' }}>
                ৳{total}
              </span>
            </div>
          </div>
        </>
      )}

      {cart.length > 0 && (
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
            gap: '12px',
            boxShadow: '0 -4px 10px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: '#757575',
              }}
            >
              Total:
            </span>

            <span
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#ff4600',
              }}
            >
              ৳{total}
            </span>
          </div>

          <a
            href="/checkout"
            style={{
              backgroundColor: '#ff4600',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'inline-block',
              boxShadow: '0 2px 6px rgba(255,70,0,0.2)',
            }}
          >
            Proceed to Checkout
          </a>
        </div>
      )}
    </div>
  );
}
