'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../../components/CartContext';
import { supabase } from '../../lib/supabase';

export default function Checkout() {
const divisionDistricts: Record<string, string[]> = {
  Dhaka: ['Dhaka','Faridpur','Gazipur','Gopalganj','Kishoreganj','Madaripur','Manikganj','Munshiganj','Narayanganj','Narsingdi','Rajbari','Shariatpur','Tangail'],
  Chattogram: ['Bandarban','Brahmanbaria','Chandpur','Chattogram','Cumilla',"Cox's Bazar",'Feni','Khagrachhari','Lakshmipur','Noakhali','Rangamati'],
  Rajshahi: ['Bogura','Chapainawabganj','Joypurhat','Naogaon','Natore','Pabna','Rajshahi','Sirajganj'],
  Khulna: ['Bagerhat','Chuadanga','Jashore','Jhenaidah','Khulna','Kushtia','Magura','Meherpur','Narail','Satkhira'],
  Barishal: ['Barguna','Barishal','Bhola','Jhalokathi','Patuakhali','Pirojpur'],
  Sylhet: ['Habiganj','Moulvibazar','Sunamganj','Sylhet'],
  Rangpur: ['Dinajpur','Gaibandha','Kurigram','Lalmonirhat','Nilphamari','Panchagarh','Rangpur','Thakurgaon'],
  Mymensingh: ['Jamalpur','Mymensingh','Netrokona','Sherpur'],
};
  const [geoData, setGeoData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/bangladesh-geo.json')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(() => setGeoData([]));
  }, []);

  const districtUpazilas: Record<string, string[]> = {};

  geoData.forEach((division) => {
    division.districts?.forEach((district: any) => {
      const upazilas =
        district.upazilas?.map(
          (upazila: any) => upazila.bn_name || upazila.name
        ) || [];

      districtUpazilas[district.name] = upazilas;

      if (district.bn_name) {
        districtUpazilas[district.bn_name] = upazilas;
      }
    });
  });

  geoData.forEach((division) => {
    division.districts?.forEach((district: any) => {
      districtUpazilas[district.bn_name || district.name] =
        district.upazilas?.map(
          (upazila: any) => upazila.bn_name || upazila.name
        ) || [];
    });
  });

  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    division: 'Dhaka',
    district: 'Dhaka',
    areaType: 'Dhaka City',
    upazila: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [transactionId, setTransactionId] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [voucherId, setVoucherId] = useState<number | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const isDhakaCity = formData.division === 'Dhaka' && formData.district === 'Dhaka' && formData.areaType === 'Dhaka City';

  const hasFreeShipping =
    cart.length > 0 &&
    cart.every((item) => item.tag === 'Free Shipping 🚚');

  const deliveryFee =
    cart.length === 0
      ? 0
      : hasFreeShipping
        ? 0
        : isDhakaCity
          ? 60
          : 120;

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const applyVoucher = async () => {
    const code = voucherCode.trim().toUpperCase();

    if (!code) {
      setVoucherMessage('❌ আগে Voucher Code লিখুন।');
      setDiscount(0);
      setVoucherId(null);
      setIsVoucherApplied(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setVoucherMessage('❌ Voucher ব্যবহার করতে আগে Login করুন।');
      return;
    }

    const { data: voucher, error: voucherError } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', code)
      .single();

    if (voucherError || !voucher) {
      setVoucherMessage('❌ এই Voucher Code সঠিক নয়।');
      setDiscount(0);
      setVoucherId(null);
      setIsVoucherApplied(false);
      return;
    }

    if (!voucher.active) {
      setVoucherMessage('❌ এই Voucher বর্তমানে Active নেই।');
      setDiscount(0);
      setVoucherId(null);
      setIsVoucherApplied(false);
      return;
    }

    if (
      voucher.expires_at &&
      new Date(voucher.expires_at).getTime() <= Date.now()
    ) {
      setVoucherMessage('❌ এই Voucher-এর মেয়াদ শেষ হয়ে গেছে।');
      setDiscount(0);
      setVoucherId(null);
      setIsVoucherApplied(false);
      return;
    }

    if (subtotal < Number(voucher.min_order_amount || 0)) {
      setVoucherMessage(
        `❌ এই Voucher ব্যবহার করতে কমপক্ষে ৳${Number(
          voucher.min_order_amount || 0
        )} টাকার অর্ডার প্রয়োজন।`
      );
      setDiscount(0);
      setVoucherId(null);
      setIsVoucherApplied(false);
      return;
    }

    const { data: collectedVoucher } = await supabase
      .from('user_vouchers')
      .select('id, used')
      .eq('user_id', user.id)
      .eq('voucher_id', voucher.id)
      .maybeSingle();

    if (!collectedVoucher) {
      setVoucherMessage('❌ আগে এই Voucher Collect করুন।');
      setDiscount(0);
      setVoucherId(null);
      setIsVoucherApplied(false);
      return;
    }

    if (collectedVoucher.used) {
      setVoucherMessage('❌ এই Voucher আপনি আগে ব্যবহার করেছেন।');
      setDiscount(0);
      setVoucherId(null);
      setIsVoucherApplied(false);
      return;
    }

    let calculatedDiscount = 0;

    if (voucher.discount_type === 'percent') {
      calculatedDiscount =
        (subtotal * Number(voucher.discount_value)) / 100;
    } else {
      calculatedDiscount = Number(voucher.discount_value);
    }

    if (voucher.max_discount !== null) {
      calculatedDiscount = Math.min(
        calculatedDiscount,
        Number(voucher.max_discount)
      );
    }

    calculatedDiscount = Math.min(calculatedDiscount, subtotal);

    setDiscount(calculatedDiscount);
    setVoucherId(voucher.id);
    setIsVoucherApplied(true);
    setVoucherMessage(
      `✅ Voucher applied! আপনি ৳${calculatedDiscount} Discount পেয়েছেন।`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('অর্ডার কনফার্ম করতে আগে Customer Account-এ Login করুন।');
      window.location.href = '/login';
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      alert('দয়া করে সব তথ্য সঠিকভাবে পূরণ করুন!');
      return;
    }

    if (cart.length === 0) {
      alert('আপনার Cart খালি। আগে একটি Product Cart-এ যোগ করুন।');
      return;
    }

    if (
      (paymentMethod === 'bkash' ||
        paymentMethod === 'nagad' ||
        paymentMethod === 'bank') &&
      !transactionId.trim()
    ) {
      alert('দয়া করে Transaction ID লিখুন।');
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.district,
          items: cart,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          discount: discount,
          voucher_code: isVoucherApplied ? voucherCode.trim().toUpperCase() : null,
          total: total,
          payment_method: paymentMethod,
          transaction_id:
            paymentMethod === 'cod'
              ? null
              : transactionId.trim(),
          division: formData.division,
          district: formData.district,
          upazila: formData.upazila || null,
          area_type: formData.areaType,
          status: 'pending',
        });

      if (error) {
        console.error('Order error:', error);
        alert('অর্ডার সংরক্ষণ করা যায়নি: ' + error.message);
        return;
      }

      if (isVoucherApplied && voucherId) {
        const { error: voucherUpdateError } = await supabase
          .from('user_vouchers')
          .update({ used: true })
          .eq('user_id', user.id)
          .eq('voucher_id', voucherId)
          .eq('used', false);

        if (voucherUpdateError) {
          console.error(
            'Voucher usage update error:',
            voucherUpdateError
          );
        }
      }

      setIsOrdered(true);
      clearCart();
    } catch (error) {
      console.error(error);
      alert('অর্ডার করার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
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
              {formData.division}, {formData.district}
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
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        padding: '14px',
        paddingBottom: '155px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <h1
        style={{
          fontSize: '20px',
          fontWeight: '800',
          margin: '4px 0 10px',
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
                width: '64px',
                height: '64px',
                borderRadius: '9px',
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
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#212121',
                }}
              >
                {item.name}
              </div>

              {item.color && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#666',
                    fontWeight: '600',
                    marginTop: '3px',
                  }}
                >
                  🎨 Color: {item.color}
                </div>
              )}

              {item.size && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#666',
                    fontWeight: '600',
                    marginTop: '2px',
                  }}
                >
                  📏 Size: {item.size}
                </div>
              )}

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
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '11px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h2
            style={{
              fontSize: '15px',
              fontWeight: '800',
              margin: '0 0 5px',
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
              padding: '12px',
              borderRadius: '9px',
              border: '1px solid #dddddd',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              width: '100%',
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
              padding: '12px',
              borderRadius: '9px',
              border: '1px solid #dddddd',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              width: '100%',
            }}
          />

          <select
            value={formData.division}
            onChange={(e) => {
              const newDivision = e.target.value;
              setFormData({
                ...formData,
                division: newDivision,
                district: divisionDistricts[newDivision][0],
                areaType:
                  newDivision === 'Dhaka'
                    ? 'Dhaka City'
                    : 'Outside Dhaka City',
              });
            }}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              fontSize: '13px',
              backgroundColor: '#ffffff',
            }}
          >
            {Object.keys(divisionDistricts).map((division) => (
              <option key={division} value={division}>
                বিভাগ: {division}
              </option>
            ))}
          </select>

          <select
            value={formData.district}
            onChange={(e) =>
              setFormData({
                ...formData,
                district: e.target.value,
                areaType:
                  formData.division === 'Dhaka' &&
                  e.target.value === 'Dhaka'
                    ? 'Dhaka City'
                    : 'Outside Dhaka City',
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
            {divisionDistricts[formData.division].map((district) => (
              <option key={district} value={district}>
                জেলা: {district}
              </option>
            ))}
          </select>

          {districtUpazilas[formData.district] && (
            <select
              value={formData.upazila}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  upazila: e.target.value,
                })
              }
              style={{
                padding: '12px',
                borderRadius: '9px',
                border: '1px solid #dddddd',
                fontSize: '14px',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="">উপজেলা নির্বাচন করুন</option>
              {districtUpazilas[formData.district].map((upazila) => (
                <option key={upazila} value={upazila}>
                  উপজেলা: {upazila}
                </option>
              ))}
            </select>
          )}

          {formData.division === 'Dhaka' &&
            formData.district === 'Dhaka' && (
              <select
                value={formData.areaType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    areaType: e.target.value,
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
                <option value="Dhaka City">
                  Dhaka City — ৳60 Delivery
                </option>
                <option value="Outside Dhaka City">
                  Dhaka District (City-এর বাইরে) — ৳120 Delivery
                </option>
              </select>
            )}

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

          {/* VOUCHER */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '16px',
              borderRadius: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              marginBottom: '12px',
            }}
          >
            <h2
              style={{
                margin: '0 0 10px',
                fontSize: '15px',
                fontWeight: '800',
                color: '#212121',
              }}
            >
              🎟️ Voucher Code
            </h2>

            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value.toUpperCase());
                  setVoucherMessage('');
                }}
                placeholder="Voucher Code লিখুন"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '12px',
                  borderRadius: '9px',
                  border: '1px solid #dddddd',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <button
                type="button"
                onClick={applyVoucher}
                style={{
                  border: 'none',
                  backgroundColor: '#7b1fa2',
                  color: '#ffffff',
                  padding: '0 16px',
                  borderRadius: '9px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Apply
              </button>
            </div>

            {voucherMessage && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: voucherMessage.startsWith('❌')
                    ? '#d32f2f'
                    : '#757575',
                  fontWeight: '700',
                }}
              >
                {voucherMessage}
              </div>
            )}
          </div>

          {/* CASH ON DELIVERY */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px',
              marginBottom: '8px',
              border:
                paymentMethod === 'cod'
                  ? '1px solid #ff4600'
                  : '1px solid #e0e0e0',
              borderRadius: '10px',
              backgroundColor:
                paymentMethod === 'cod' ? '#fff0e6' : '#ffffff',
              boxShadow: paymentMethod === 'cod'
                ? '0 2px 6px rgba(255,70,0,0.08)'
                : 'none',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => {
                setPaymentMethod('cod');
                setTransactionId('');
              }}
            />

            <div
              style={{
                flex: 1,
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              Cash on Delivery (COD)

              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 'normal',
                  color: '#757575',
                  marginTop: '2px',
                }}
              >
                পণ্য হাতে পেয়ে টাকা পরিশোধ করুন
              </div>
            </div>
          </label>

          {/* BKASH */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px',
              marginBottom: '8px',
              border:
                paymentMethod === 'bkash'
                  ? '1px solid #e2136e'
                  : '1px solid #e0e0e0',
              borderRadius: '10px',
              backgroundColor:
                paymentMethod === 'bkash' ? '#fff0f6' : '#ffffff',
              boxShadow: paymentMethod === 'bkash'
                ? '0 2px 6px rgba(226,19,110,0.10)'
                : 'none',
            }}
          >
            <input
              type="radio"
              name="payment"
              value="bkash"
              checked={paymentMethod === 'bkash'}
              onChange={() => setPaymentMethod('bkash')}
            />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '800',
                }}
              >
                🟣 bKash Personal
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#e2136e',
                  marginTop: '4px',
                }}
              >
                📱 01994245811
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('01994245811');
                  alert('bKash Number কপি হয়েছে');
                }}
                style={{
                  marginTop: '4px',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '4px 8px',
                  backgroundColor: '#fce7f3',
                  color: '#be185d',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                📋 Copy Number
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPaymentMethod('bkash');
                window.location.href = 'bkash://';
              }}
              style={{
                border: 'none',
                borderRadius: '6px',
                padding: '8px 10px',
                backgroundColor: '#e2136e',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Pay with bKash →
            </button>
          </div>

          {/* NAGAD */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px',
              marginBottom: '8px',
              border:
                paymentMethod === 'nagad'
                  ? '1px solid #f58220'
                  : '1px solid #e0e0e0',
              borderRadius: '10px',
              backgroundColor:
                paymentMethod === 'nagad' ? '#fff7ed' : '#ffffff',
              boxShadow: paymentMethod === 'nagad'
                ? '0 2px 6px rgba(245,130,32,0.10)'
                : 'none',
            }}
          >
            <input
              type="radio"
              name="payment"
              value="nagad"
              checked={paymentMethod === 'nagad'}
              onChange={() => setPaymentMethod('nagad')}
            />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '800',
                }}
              >
                🟢 Nagad Personal
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#f58220',
                  marginTop: '4px',
                }}
              >
                📱 01994245811
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('01994245811');
                  alert('Nagad Number কপি হয়েছে');
                }}
                style={{
                  marginTop: '4px',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '4px 8px',
                  backgroundColor: '#ffedd5',
                  color: '#c2410c',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                📋 Copy Number
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPaymentMethod('nagad');
                window.location.href = 'nagad://';
              }}
              style={{
                border: 'none',
                borderRadius: '6px',
                padding: '8px 10px',
                backgroundColor: '#f58220',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Pay with Nagad →
            </button>
          </div>

          {/* BANK PAYMENT */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px',
              marginBottom: '8px',
              border:
                paymentMethod === 'bank'
                  ? '1px solid #1976d2'
                  : '1px solid #e0e0e0',
              borderRadius: '10px',
              backgroundColor:
                paymentMethod === 'bank' ? '#eef6ff' : '#ffffff',
              boxShadow: paymentMethod === 'bank'
                ? '0 2px 6px rgba(25,118,210,0.10)'
                : 'none',
            }}
          >
            <input
              type="radio"
              name="payment"
              value="bank"
              checked={paymentMethod === 'bank'}
              onChange={() => setPaymentMethod('bank')}
            />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '800',
                }}
              >
                🏦 Bank Payment
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              style={{
                border: 'none',
                borderRadius: '6px',
                padding: '8px 10px',
                backgroundColor: '#1976d2',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Bank Payment →
            </button>
          </div>

          {/* TRANSACTION ID */}
          {(paymentMethod === 'bkash' ||
            paymentMethod === 'nagad' ||
            paymentMethod === 'bank') && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#f7f7f7',
              }}
            >
              {paymentMethod === 'bkash' && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#555',
                    marginBottom: '8px',
                  }}
                >
                  bKash App থেকে পেমেন্ট সম্পন্ন করে Transaction ID দিন।
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#555',
                    marginBottom: '8px',
                  }}
                >
                  Nagad App থেকে পেমেন্ট সম্পন্ন করে Transaction ID দিন।
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#555',
                    marginBottom: '8px',
                    lineHeight: '1.6',
                  }}
                >
                  <strong>Bank:</strong> Dutch-Bangla Bank (DBBL)
                  <br />
                  <strong>Account Name:</strong> MD EBRAHIM KHALIL
                  <br />
                  <strong>Account Number:</strong> 2171600005018
                  <br />
                  <strong>Branch:</strong> Ruhitpur
                </div>
              )}

              <input
                type="text"
                placeholder="Transaction ID লিখুন"
                required
                name="transaction_id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          )}
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
          {isVoucherApplied && discount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#2e7d32',
                fontWeight: '700',
                marginTop: '6px',
              }}
            >
              <span>Voucher Discount</span>
              <span>-৳{discount}</span>
            </div>
          )}

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
            boxShadow: '0 -4px 14px rgba(0,0,0,0.08)',
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
