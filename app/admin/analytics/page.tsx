"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  items: any;
  created_at: string;
};

type ProductSale = {
  name: string;
  quantity: number;
  revenue: number;
};

type VisitorStats = {
  total_visitors: number;
  today_visitors: number;
  logged_in_visitors: number;
  today_logged_in_visitors: number;
};

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    total_visitors: 0,
    today_visitors: 0,
    logged_in_visitors: 0,
    today_logged_in_visitors: 0,
  });

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7" | "30" | "all">("7");

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    const [{ data: orderData, error: orderError }, { data: visitorData, error: visitorError }] =
      await Promise.all([
        supabase
          .from("orders")
          .select("id, customer_name, total, status, items, created_at")
          .order("created_at", { ascending: false }),

        supabase.rpc("get_admin_visitor_stats"),
      ]);

    if (orderError) {
      console.error("Analytics order error:", orderError);
    }

    if (visitorError) {
      console.error("Visitor stats error:", visitorError);
    }

    setOrders((orderData || []) as Order[]);

    if (visitorData) {
      setVisitorStats({
        total_visitors: Number(visitorData.total_visitors || 0),
        today_visitors: Number(visitorData.today_visitors || 0),
        logged_in_visitors: Number(visitorData.logged_in_visitors || 0),
        today_logged_in_visitors: Number(
          visitorData.today_logged_in_visitors || 0
        ),
      });
    }

    setLoading(false);
  }

  const completedOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === "delivered" ||
          order.status === "completed"
      ),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (period === "all") return completedOrders;

    const days = Number(period);
    const since = new Date();
    since.setDate(since.getDate() - days);

    return completedOrders.filter(
      (order) => new Date(order.created_at) >= since
    );
  }, [completedOrders, period]);

  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalOrders = filteredOrders.length;

  const totalProductsSold = filteredOrders.reduce((sum, order) => {
    if (!Array.isArray(order.items)) return sum;

    return (
      sum +
      order.items.reduce(
        (itemSum: number, item: any) =>
          itemSum + Number(item.quantity || 1),
        0
      )
    );
  }, 0);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const todayOrders = completedOrders.filter(
    (order) => order.created_at?.split("T")[0] === todayString
  );

  const todaySales = todayOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const productSales = useMemo<ProductSale[]>(() => {
    const map = new Map<string, ProductSale>();

    filteredOrders.forEach((order) => {
      if (!Array.isArray(order.items)) return;

      order.items.forEach((item: any) => {
        const name =
          item.name ||
          item.title ||
          "Unknown Product";

        const quantity = Number(item.quantity || 1);
        const price = Number(item.price || 0);

        const existing = map.get(name);

        if (existing) {
          existing.quantity += quantity;
          existing.revenue += price * quantity;
        } else {
          map.set(name, {
            name,
            quantity,
            revenue: price * quantity,
          });
        }
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders]);

  const dailySales = useMemo(() => {
    const days =
      period === "7"
        ? 7
        : period === "30"
        ? 30
        : 7;

    const result: {
      label: string;
      sales: number;
      orders: number;
    }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const dateString = date.toISOString().split("T")[0];

      const dayOrders = filteredOrders.filter(
        (order) =>
          order.created_at?.split("T")[0] === dateString
      );

      const sales = dayOrders.reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );

      result.push({
        label: date.toLocaleDateString("bn-BD", {
          day: "numeric",
          month: "short",
        }),
        sales,
        orders: dayOrders.length,
      });
    }

    return result;
  }, [filteredOrders, period]);

  const maxSales = Math.max(
    ...dailySales.map((item) => item.sales),
    1
  );

  const taka = (amount: number) =>
    `৳${amount.toLocaleString("bn-BD")}`;

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
          textAlign: "center",
          background: "#f5f7fb",
        }}
      >
        <h2>📊 Analytics</h2>
        <p>ডাটা লোড হচ্ছে...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "26px",
              }}
            >
              📊 Analytics Dashboard
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Friends Shop-এর বিক্রি, Visitor ও User রিপোর্ট
            </p>
          </div>

          <a
            href="/admin"
            style={{
              background: "#212121",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            ← Admin Dashboard
          </a>
        </div>

        {/* Period Filter */}
        <div
          style={{
            background: "#fff",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "18px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setPeriod("7")}
            style={filterButton(period === "7")}
          >
            📅 ৭ দিন
          </button>

          <button
            onClick={() => setPeriod("30")}
            style={filterButton(period === "30")}
          >
            📅 ৩০ দিন
          </button>

          <button
            onClick={() => setPeriod("all")}
            style={filterButton(period === "all")}
          >
            📊 সব সময়
          </button>

          <button
            onClick={loadAnalytics}
            style={{
              ...filterButton(false),
              marginLeft: "auto",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Visitor Stats */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            👥 Visitor & User Analytics
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >
            <StatCard
              icon="👀"
              title="মোট Visitor"
              value={visitorStats.total_visitors.toLocaleString(
                "bn-BD"
              )}
              background="#e3f2fd"
            />

            <StatCard
              icon="📅"
              title="আজকের Visitor"
              value={visitorStats.today_visitors.toLocaleString(
                "bn-BD"
              )}
              background="#e8f5e9"
            />

            <StatCard
              icon="👤"
              title="Logged-in Visitor"
              value={visitorStats.logged_in_visitors.toLocaleString(
                "bn-BD"
              )}
              background="#fff3e0"
            />

            <StatCard
              icon="🟢"
              title="আজকের Logged-in Visitor"
              value={visitorStats.today_logged_in_visitors.toLocaleString(
                "bn-BD"
              )}
              background="#f3e5f5"
            />
          </div>

          <div
            style={{
              marginTop: "14px",
              padding: "14px",
              background: "#f8f9fa",
              borderRadius: "8px",
              color: "#666",
              fontSize: "13px",
            }}
          >
            💡 Visitor সংখ্যা একই ব্রাউজারকে একই Visitor হিসেবে
            গণনা করে। একই দিনে একই ব্রাউজার বারবার ঢুকলে নতুন Visitor
            হিসেবে গণনা হবে না।
          </div>
        </section>

        {/* Sales Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          <StatCard
            icon="💰"
            title="মোট বিক্রি"
            value={taka(totalSales)}
            background="#e8f5e9"
          />

          <StatCard
            icon="📦"
            title="মোট অর্ডার"
            value={totalOrders.toLocaleString("bn-BD")}
            background="#e3f2fd"
          />

          <StatCard
            icon="🛒"
            title="বিক্রি হওয়া পণ্য"
            value={totalProductsSold.toLocaleString("bn-BD")}
            background="#fff3e0"
          />

          <StatCard
            icon="📅"
            title="আজকের অর্ডার"
            value={todayOrders.length.toLocaleString("bn-BD")}
            background="#f3e5f5"
          />

          <StatCard
            icon="💵"
            title="আজকের বিক্রি"
            value={taka(todaySales)}
            background="#fff8e1"
          />
        </div>

        {/* Sales Chart */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            📈 দৈনিক বিক্রির চার্ট
          </h2>

          <div
            style={{
              height: "280px",
              display: "flex",
              alignItems: "flex-end",
              gap: "5px",
              overflowX: "auto",
              padding: "20px 5px 5px",
            }}
          >
            {dailySales.map((day, index) => {
              const height =
                day.sales === 0
                  ? 4
                  : Math.max(
                      8,
                      (day.sales / maxSales) * 220
                    );

              return (
                <div
                  key={index}
                  style={{
                    minWidth:
                      period === "30" ? "24px" : "38px",
                    height: "240px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <div
                    title={`${day.label}: ${taka(day.sales)}`}
                    style={{
                      width:
                        period === "30"
                          ? "18px"
                          : "28px",
                      height: `${height}px`,
                      background: "#1976d2",
                      borderRadius: "5px 5px 0 0",
                      transition: "height .3s",
                    }}
                  />

                  <span
                    style={{
                      fontSize:
                        period === "30"
                          ? "8px"
                          : "10px",
                      color: "#666",
                      whiteSpace: "nowrap",
                      transform:
                        period === "30"
                          ? "rotate(-45deg)"
                          : "none",
                    }}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Products */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            🏆 Top Selling Products
          </h2>

          {productSales.length === 0 ? (
            <p style={{ color: "#777" }}>
              এখনো কোনো Completed/Delivered product sale নেই।
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {productSales.map((product, index) => (
                <div
                  key={product.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background:
                        index === 0
                          ? "#ffd54f"
                          : "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                    }}
                  >
                    {index + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      {product.name}
                    </div>

                    <div
                      style={{
                        color: "#777",
                        fontSize: "12px",
                        marginTop: "3px",
                      }}
                    >
                      বিক্রি:{" "}
                      {product.quantity.toLocaleString(
                        "bn-BD"
                      )}{" "}
                      টি
                    </div>
                  </div>

                  <strong>
                    {taka(product.revenue)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Orders */}
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>
            📋 সাম্প্রতিক অর্ডার
          </h2>

          {orders.length === 0 ? (
            <p style={{ color: "#777" }}>
              এখনো কোনো অর্ডার পাওয়া যায়নি।
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "650px",
                }}
              >
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={th}>Customer</th>
                    <th style={th}>Amount</th>
                    <th style={th}>Status</th>
                    <th style={th}>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id}>
                      <td style={td}>
                        {order.customer_name || "Unknown"}
                      </td>

                      <td style={td}>
                        {taka(Number(order.total || 0))}
                      </td>

                      <td style={td}>
                        <span
                          style={{
                            padding: "5px 9px",
                            borderRadius: "20px",
                            background:
                              order.status === "delivered" ||
                              order.status === "completed"
                                ? "#e8f5e9"
                                : "#fff3e0",
                            color:
                              order.status === "delivered" ||
                              order.status === "completed"
                                ? "#2e7d32"
                                : "#e65100",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {order.status || "pending"}
                        </span>
                      </td>

                      <td style={td}>
                        {new Date(
                          order.created_at
                        ).toLocaleDateString("bn-BD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  background,
}: {
  icon: string;
  title: string;
  value: string;
  background: string;
}) {
  return (
    <div
      style={{
        background,
        borderRadius: "12px",
        padding: "18px",
        minHeight: "105px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "24px" }}>
        {icon}
      </div>

      <div
        style={{
          color: "#666",
          fontSize: "13px",
          marginTop: "5px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "21px",
          fontWeight: "800",
          marginTop: "4px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function filterButton(active: boolean): React.CSSProperties {
  return {
    border: "none",
    cursor: "pointer",
    padding: "9px 14px",
    borderRadius: "7px",
    background: active ? "#1976d2" : "#eeeeee",
    color: active ? "#fff" : "#333",
    fontWeight: "700",
    fontSize: "13px",
  };
}

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  marginTop: "20px",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const sectionTitle: React.CSSProperties = {
  marginTop: 0,
  fontSize: "19px",
  marginBottom: "18px",
};

const th: React.CSSProperties = {
  padding: "12px 10px",
  textAlign: "left",
  fontSize: "13px",
  borderBottom: "1px solid #ddd",
};

const td: React.CSSProperties = {
  padding: "12px 10px",
  fontSize: "13px",
  borderBottom: "1px solid #eee",
};
