"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const loadAccount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email || "");
      setName(user.user_metadata?.name || "");

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (orderError) {
        console.error("Orders error:", orderError);
      } else {
        setOrders(orderData || []);
      }

      setOrdersLoading(false);
      setLoading(false);
    };

    loadAccount();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <main style={{ padding: "30px", textAlign: "center" }}>
        Loading account...
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "25px" }}>
        👤 My Account
      </h1>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <p style={{ marginBottom: "12px" }}>
          <strong>Name:</strong> {name || "Customer"}
        </p>

        <p>
          <strong>Email:</strong> {email}
        </p>
      </div>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
          📦 My Orders
        </h2>

        {ordersLoading ? (
          <p>Orders loading...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: "#777" }}>এখনো কোনো Order নেই।</p>
        ) : (
          <div>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "12px",
                  background: "#fafafa",
                }}
              >
                <p><strong>Order ID:</strong> #{order.id}</p>

                <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                  <strong>🛍️ Products</strong>

                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    <div style={{ marginTop: "10px" }}>
                      {order.items.map((item: any, index: number) => (
                        <div
                          key={item.id || index}
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom:
                              index < order.items.length - 1
                                ? "1px solid #eee"
                                : "none",
                          }}
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name || "Product"}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                              }}
                            />
                          )}

                          <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
                              {item.name || "Product"}
                            </p>
                            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                              ৳{item.price} × {item.quantity || 1}
                            </p>
                          </div>

                          <strong>
                            ৳{(item.price || 0) * (item.quantity || 1)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#777", marginTop: "10px" }}>
                      Product details পাওয়া যায়নি।
                    </p>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    marginBottom: "12px",
                    padding: "12px",
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                  }}
                >
                  <strong>🏠 Delivery Address</strong>
                  <p style={{ margin: "8px 0 0" }}>
                    <strong>ঠিকানা:</strong> {order.address || "-"}
                  </p>
                  <p style={{ margin: "5px 0 0" }}>
                    <strong>বিভাগ:</strong> {order.division || "-"}
                  </p>
                  <p style={{ margin: "5px 0 0" }}>
                    <strong>জেলা:</strong> {order.district || order.city || "-"}
                  </p>
                  <p style={{ margin: "5px 0 0" }}>
                    <strong>উপজেলা/থানা:</strong> {order.upazila || "-"}
                  </p>
                  <p style={{ margin: "5px 0 0" }}>
                    <strong>এলাকা:</strong> {order.area_type || "-"}
                  </p>
                </div>

                <p><strong>Subtotal:</strong> ৳{order.subtotal}</p>
                <p><strong>Delivery Fee:</strong> ৳{order.delivery_fee}</p>
                <p><strong>Total:</strong> ৳{order.total}</p>
                <p><strong>Payment:</strong> {order.payment_method}</p>

                <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                  <strong>📦 Order Status</strong>

                  {order.status === "cancelled" ? (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "12px",
                        borderRadius: "8px",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      ❌ Order Cancelled
                    </div>
                  ) : (
                    <div style={{ marginTop: "15px" }}>
                      {[
                        { key: "pending", icon: "🕐", label: "অর্ডার গ্রহণ" },
                        { key: "confirmed", icon: "✅", label: "নিশ্চিত" },
                        { key: "processing", icon: "⚙️", label: "প্রস্তুত হচ্ছে" },
                        { key: "shipped", icon: "🚚", label: "পাঠানো হয়েছে" },
                        { key: "delivered", icon: "🎉", label: "পৌঁছে গেছে" },
                      ].map((step, index) => {
                        const statusOrder = [
                          "pending",
                          "confirmed",
                          "processing",
                          "shipped",
                          "delivered",
                        ];

                        const currentIndex = statusOrder.indexOf(
                          order.status || "pending"
                        );

                        const stepIndex = statusOrder.indexOf(step.key);
                        const completed = stepIndex <= currentIndex;

                        return (
                          <div
                            key={step.key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom:
                                index < 4 ? "8px" : "0",
                              fontSize: "14px",
                              fontWeight: completed ? "bold" : "normal",
                              color: completed ? "#16a34a" : "#999",
                            }}
                          >
                            <span
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: completed ? "#dcfce7" : "#f3f4f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {step.icon}
                            </span>

                            <span>{step.label}</span>

                            {completed && stepIndex === currentIndex && (
                              <span style={{ marginLeft: "auto", fontSize: "12px" }}>
                                বর্তমান
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <p>
                  <strong>Date:</strong>{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString("en-BD")
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "13px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>
    </main>
  );
}
