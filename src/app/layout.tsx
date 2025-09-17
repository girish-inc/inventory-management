import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Mini inventory management system for retail business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gray-900 text-white shadow-xl border-b-2 border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-18">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold hover:text-blue-300 transition-colors">
                  📦 Inventory Management
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  href="/dashboard" 
                  className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 hover:text-blue-300 transition-all duration-200 border border-transparent hover:border-gray-600"
                >
                  📊 Dashboard
                </Link>
                <Link 
                  href="/products" 
                  className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 hover:text-blue-300 transition-all duration-200 border border-transparent hover:border-gray-600"
                >
                  📦 Products
                </Link>
                <Link 
                  href="/suppliers" 
                  className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 hover:text-blue-300 transition-all duration-200 border border-transparent hover:border-gray-600"
                >
                  🏢 Suppliers
                </Link>
                <Link 
                  href="/transactions" 
                  className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 hover:text-blue-300 transition-all duration-200 border border-transparent hover:border-gray-600"
                >
                  💰 Transactions
                </Link>
                <Link 
                  href="/reports" 
                  className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 hover:text-blue-300 transition-all duration-200 border border-transparent hover:border-gray-600"
                >
                  📈 Reports
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}
