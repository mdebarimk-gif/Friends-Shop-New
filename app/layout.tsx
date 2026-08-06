import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../components/CartContext";

export const metadata: Metadata = {
  title: "Friends Shop",
  description: "Friends Shop Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col antialiased">
        <CartProvider>
          {/* Header */}
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

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto w-full p-4">
            {children}
          </main>

          {/* Bottom Navigation */}
          <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow">
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
