"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

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
