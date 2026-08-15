import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SearchBar from "../components/SearchBar";
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

          {children}

        </CartProvider>
      </body>
    </html>
  );
}
