import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "../components/CartContext";

export const metadata: Metadata = {
  title: "Friends Shop | Premium E-commerce Store",
  description: "Friends Shop Ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="bn">
      <body
        className="bg-gray-100 text-gray-900 min-h-screen m-0 p-0 antialiased"
        style={{ fontFamily: "sans-serif" }}
      >
        <CartProvider>
          {/* ==================== TOP SEARCH BAR ==================== */}
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              width: "100%",
              backgroundColor: "#ff4600",
              padding: "8px 12px",
              boxSizing: "border-box",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              height: "56px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  padding: "0 10px",
                  alignItems: "center",
                  height: "36px",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    marginRight: "6px",
                  }}
                >
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search in Friends Shop..."
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    color: "#333333",
                    fontSize: "14px",
                  }}
                />
              </div>

              <button
                type="button"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#ff4600",
                  border: "none",
                  borderRadius: "20px",
                  height: "36px",
                  padding: "0 14px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>
          </header>

          {/* ==================== MAIN CONTENT ==================== */}
          <main
            className="flex-1 mx-auto w-full"
            style={{
              boxSizing: "border-box",
              paddingBottom: "72px",
            }}
          >
            {children}
          </main>

          {/* ==================== BOTTOM NAVIGATION ==================== */}
          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              zIndex: 50,
              width: "100%",
              height: "64px",
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e5e5e5",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              boxSizing: "border-box",
            }}
          >
            {/* For You */}
            <a
              href="/"
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "#ff4600",
                fontWeight: "600",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3 3 10v10a1 1 0 0 0 1 1h6v-6h4v6h6a1 1 0 0 0 1-1V10l-9-7z" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  marginTop: "3px",
                }}
              >
                For You
              </span>
            </a>

            {/* Categories */}
            <a
              href="/search"
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "#757575",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  marginTop: "3px",
                }}
              >
                Categories
              </span>
            </a>

            {/* Cart */}
            <a
              href="/cart"
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "#757575",
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8h12l1 12H5L6 8z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>

                <span
                  style={{
                    position: "absolute",
                    top: "-7px",
                    right: "-9px",
                    minWidth: "17px",
                    height: "17px",
                    padding: "0 4px",
                    backgroundColor: "#ff4600",
                    color: "#ffffff",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  0
                </span>
              </div>

              <span
                style={{
                  fontSize: "11px",
                  marginTop: "3px",
                }}
              >
                Cart
              </span>
            </a>

            {/* Account */}
            <a
              href="/login"
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "#757575",
              }}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>

              <span
                style={{
                  fontSize: "11px",
                  marginTop: "3px",
                }}
              >
                Account
              </span>
            </a>
          </nav>
        </CartProvider>
      </body>
    </html>
  );
}
