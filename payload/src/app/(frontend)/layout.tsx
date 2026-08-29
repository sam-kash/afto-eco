import React from 'react';
import './styles.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'AFTO-ECO',
  description: 'Shop fresh produce, prepared foods, beverages, and everyday essentials from AFTO-ECO. Order for pickup or delivery.',
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#faf7f0] text-[#1a1a1a]">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
