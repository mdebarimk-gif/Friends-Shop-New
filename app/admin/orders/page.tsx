"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  items: any[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("অর্ডার লোড করা যায়নি: " + error.message);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Status পরিবর্তন করা যায়নি: " + error.message);
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  }

  async function deleteOrder(id: number) {
    if (!confirm("এই অর্ডারটি কি মুছে ফেলতে চান?")) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      alert("অর্ডার মুছে ফেলা যায়নি: " + error.message);
      return;
    }

    setOrders((prev) => prev.filter((order) => order.id !== id));
  }

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        📦 Order Management
      </h1>

      <button
        onClick={loadOrders}
        style={{
          padding: "10px 16px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "none",
          background: "#f97316",
          color: "white",
          fontWeight: "bold",
        }}
      >
        🔄 Refresh Orders
      </button>

      {loading ? (
        <p>অর্ডার লোড হচ্ছে...</p>
      ) : orders.length === 0 ? (
        <p>কোনো অর্ডার পাওয়া যায়নি।</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                <strong>Order #{order.id}</strong>

                <select
                  value={order.status || "pending"}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                  style={{
                    padding: "7px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <p><strong>নাম:</strong> {order.customer_name}</p>
              <p><strong>ফোন:</strong> {order.phone}</p>
              <p>
                <strong>ঠিকানা:</strong> {order.address}, {order.city}
              </p>
              <p>
                <strong>Payment:</strong> {order.payment_method}
              </p>

              <hr style={{ margin: "14px 0" }} />

              <strong>Products:</strong>

              <div style={{ marginTop: "8px" }}>
                {(order.items || []).map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                    }}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      ৳{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <hr style={{ margin: "14px 0" }} />

              <p>
                <strong>Subtotal:</strong> ৳{order.subtotal}
              </p>
              <p>
                <strong>Delivery:</strong> ৳{order.delivery_fee}
              </p>
              <p style={{ fontSize: "18px" }}>
                <strong>Total: ৳{order.total}</strong>
              </p>

              <p
                style={{
                  fontSize: "12px",
                  color: "#777",
                  marginTop: "10px",
                }}
              >
                {new Date(order.created_at).toLocaleString("bn-BD")}
              </p>

              <button
                onClick={() => deleteOrder(order.id)}
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                }}
              >
                🗑️ Delete Order
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
