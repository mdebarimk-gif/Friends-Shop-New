"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password কমপক্ষে 6 অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("দুইটি Password একই নয়।");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password সফলভাবে পরিবর্তন হয়েছে। এখন Admin Login করুন।");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
          🔐 Reset Password
        </h1>

        <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>
          নতুন Admin Password সেট করুন
        </p>

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#ff4600",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "18px",
              textAlign: "center",
              color: "#333",
              lineHeight: "1.5",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
