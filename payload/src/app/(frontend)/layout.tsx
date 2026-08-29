import React from 'react';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './styles.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'AFTO-ECO Organic Market',
  description: 'Shop fresh produce, prepared foods, beverages, and everyday essentials from AFTO-ECO. Order for pickup or delivery.',
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#faf7f2] text-[#1c1c1a] font-sans antialiased min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
