import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../components/CartContext";

export const metadata: Metadata = {
  title: "Friends Shop | Premium E-commerce Store",
  description: "Friends Shop Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className="bg-gray-100 text-gray-900 min-h-screen m-0 p-0 flex flex-col antialiased"
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
              height: "56px",
              backgroundColor: "#ff4600",
              padding: "8px 12px",
              boxSizing: "border-box",
              boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
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
              {/* Search Input */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  padding: "2px 4px 2px 12px",
                  alignItems: "center",
                  height: "36px",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
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
                    fontSize: "13px",
                    color: "#333333",
                    backgroundColor: "transparent",
                  }}
                />
              </div>

              {/* Search Button */}
              <button
                type="button"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#ff4600",
                  border: "none",
                  borderRadius: "20px",
                  height: "36px",
                  padding: "0 14px",
                  fontSize: "12px",
                  fontWeight: "bold",
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
              paddingBottom: "70px",
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
              height: "58px",
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e5e5e5",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {/* Home */}
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
              }}
            >
              <span style={{ fontSize: "20px", lineHeight: "20px" }}>
                🏠
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  marginTop: "3px",
                }}
              >
                Home
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
              <span style={{ fontSize: "20px", lineHeight: "20px" }}>
                ☰
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
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
              <span style={{ fontSize: "20px", lineHeight: "20px" }}>
                🛒
              </span>

              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
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
              <span style={{ fontSize: "20px", lineHeight: "20px" }}>
                👤
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
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
}import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../components/CartContext";

export const metadata: Metadata = {
  title: "Friends Shop",
  description: "Friends Shop Ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col antialiased">
        <CartProvider>
          <header className="sticky top-0 z-50 bg-orange-600 p-3 shadow">
            <div className="max-w-7xl mx-auto flex gap-2">
              <input
                type="text"
                placeholder="Search in Friends Shop..."
                className="flex-1 rounded-full px-4 py-2 outline-none text-black"
              />

              <button className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold">
                Search
              </button>
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto w-full p-4 pb-20">
            {children}
          </main>

          <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow z-50">
            <div className="grid grid-cols-4 text-center py-3">
              <a href="/" className="text-orange-600 font-semibold">
                Home
              </a>

              <a href="/search" className="text-gray-600">
                Categories
              </a>

              <a href="/cart" className="text-gray-600">
                Cart
              </a>

              <a href="/login" className="text-gray-600">
                Account
              </a>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
