'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Product = {
  id: number;
  title: string;
  price: number;
  old_price: number | null;
  category: string;
  stock: number;
  tag: string | null;
  description: string | null;
  image_url: string | null;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    price: '',
    oldPrice: '',
    category: 'fashion',
    stock: '',
    tag: '',
    description: '',
  });

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      setMessage('❌ পণ্য লোড করা যায়নি।');
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const startEdit = (product: Product) => {
    setEditingId(product.id);

    setEditData({
      title: product.title,
      price: String(product.price),
      oldPrice: product.old_price !== null ? String(product.old_price) : '',
      category: product.category,
      stock: String(product.stock),
      tag: product.tag || '',
      description: product.description || '',
    });

    setMessage('');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    if (!editData.title || !editData.price || !editData.stock) {
      setMessage('❌ নাম, দাম এবং Stock প্রয়োজন।');
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({
        title: editData.title,
        price: Number(editData.price),
        old_price: editData.oldPrice
          ? Number(editData.oldPrice)
          : null,
        category: editData.category,
        stock: Number(editData.stock),
        tag: editData.tag || null,
        description: editData.description || null,
      })
      .eq('id', editingId);

    if (error) {
      console.error(error);
      setMessage('❌ পণ্য আপডেট করা যায়নি।');
      return;
    }

    setMessage('✅ পণ্য সফলভাবে আপডেট হয়েছে।');
    setEditingId(null);

    await loadProducts();
  };

  const deleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `"${product.title}" পণ্যটি কি সত্যিই Delete করতে চান?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (error) {
      console.error(error);
      setMessage('❌ পণ্য Delete করা যায়নি।');
      return;
    }

    setMessage('✅ পণ্য Delete হয়েছে।');

    await loadProducts();
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
          marginBottom: '12px',
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
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '15px',
        }}
      >
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: '17px',
            fontWeight: '800',
          }}
        >
          📦 Manage Products
        </h2>

        {loading ? (
          <p style={{ fontSize: '13px' }}>পণ্য লোড হচ্ছে...</p>
        ) : products.length === 0 ? (
          <p style={{ fontSize: '13px' }}>
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '9px',
                  padding: '10px',
                  backgroundColor: '#fafafa',
                }}
              >
                {editingId === product.id ? (
                  <>
                    <h3
                      style={{
                        margin: '0 0 10px',
                        fontSize: '15px',
                      }}
                    >
                      ✏️ Edit Product
                    </h3>

                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          title: e.target.value,
                        })
                      }
                      placeholder="পণ্যের নাম"
                      style={inputStyle}
                    />

                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price: e.target.value,
                        })
                      }
                      placeholder="বিক্রয় মূল্য"
                      style={inputStyle}
                    />

                    <input
                      type="number"
                      value={editData.oldPrice}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          oldPrice: e.target.value,
                        })
                      }
                      placeholder="পুরাতন মূল্য"
                      style={inputStyle}
                    />

                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          category: e.target.value,
                        })
                      }
                      style={inputStyle}
                    >
                      <option value="fashion">Fashion</option>
                      <option value="gadgets">Gadgets</option>
                      <option value="mart">Mart</option>
                      <option value="beauty">Beauty</option>
                    </select>

                    <input
                      type="number"
                      min="0"
                      value={editData.stock}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          stock: e.target.value,
                        })
                      }
                      placeholder="Stock"
                      style={inputStyle}
                    />

                    <input
                      value={editData.tag}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          tag: e.target.value,
                        })
                      }
                      placeholder="Tag"
                      style={inputStyle}
                    />

                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      placeholder="পণ্যের বিবরণ"
                      rows={4}
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                      }}
                    />

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginTop: '8px',
                      }}
                    >
                      <button
                        onClick={saveEdit}
                        style={saveButtonStyle}
                      >
                        💾 Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        style={cancelButtonStyle}
                      >
                        ✖ Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                      }}
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          style={{
                            width: '75px',
                            height: '75px',
                            objectFit: 'cover',
                            borderRadius: '7px',
                            backgroundColor: '#eee',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '75px',
                            height: '75px',
                            borderRadius: '7px',
                            backgroundColor: '#eeeeee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px',
                          }}
                        >
                          📦
                        </div>
                      )}

                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: '800',
                          }}
                        >
                          {product.title}
                        </h3>

                        <p
                          style={{
                            margin: '5px 0',
                            fontSize: '13px',
                            color: '#555',
                          }}
                        >
                          💰 ৳{product.price}
                        </p>

                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color:
                              product.stock > 0
                                ? '#2e7d32'
                                : '#c62828',
                            fontWeight: '700',
                          }}
                        >
                          📦 Stock: {product.stock}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginTop: '10px',
                      }}
                    >
                      <button
                        onClick={() => startEdit(product)}
                        style={editButtonStyle}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product)}
                        style={deleteButtonStyle}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
        <a href="/admin/orders" style={{display:"block",padding:"14px",marginTop:"16px",borderRadius:"10px",background:"#f97316",color:"white",textAlign:"center",fontWeight:"bold",textDecoration:"none"}}>📦 Order Management</a>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: '8px',
  padding: '10px',
  boxSizing: 'border-box',
  border: '1px solid #ddd',
  borderRadius: '7px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#fff',
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  padding: '10px',
  fontSize: '13px',
  fontWeight: '700',
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#d32f2f',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  padding: '10px',
  fontSize: '13px',
  fontWeight: '700',
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: '#2e7d32',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  padding: '10px',
  fontSize: '13px',
  fontWeight: '700',
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: '#757575',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  padding: '10px',
  fontSize: '13px',
  fontWeight: '700',
};
