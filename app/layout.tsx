import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SearchBar from "../components/SearchBar";
import { CartProvider } from "../components/CartContext";
import Footer from "../components/footer";

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
          {/* Top Search Bar */}
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
              minHeight: "56px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchBar />
          </header>

          {/* Main Content */}
          <main style={{ paddingBottom: "70px" }}>
            {children}
          </main>

          <Footer />

      {/* Bottom Navigation */}
          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e5e5e5",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              zIndex: 100,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "#555",
                textAlign: "center",
                fontSize: "11px",
              }}
            >
              <div style={{ fontSize: "22px" }}>🏠</div>
              Home
            </a>

            <a
              href="/search"
              style={{
                textDecoration: "none",
                color: "#555",
                textAlign: "center",
                fontSize: "11px",
              }}
            >
              <div style={{ fontSize: "22px" }}>🔍</div>
              Search
            </a>

            <a
              href="/cart"
              style={{
                textDecoration: "none",
                color: "#555",
                textAlign: "center",
                fontSize: "11px",
              }}
            >
              <div style={{ fontSize: "22px" }}>🛒</div>
              Cart
            </a>

            <a
              href="/admin"
              style={{
                textDecoration: "none",
                color: "#555",
                textAlign: "center",
                fontSize: "11px",
              }}
            >
              <div style={{ fontSize: "22px" }}>👤</div>
              Account
            </a>
          </nav>
        </CartProvider>
      </body>
    </html>
  );
}
