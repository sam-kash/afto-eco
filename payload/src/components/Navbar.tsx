'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import CartDrawer from './CartDrawer';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { itemCount, setShowCart, showCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Toronto Main Store');

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#1a3c2a] text-[#e2ebd4] text-center py-2 px-4 text-[11px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#85c996] animate-pulse" />
        <span>Free delivery on orders over $75 · Fresh. Local. Yours.</span>
      </div>

      {/* Summerhill Header Layout */}
      <header className="bg-white border-b border-[#e6dfd1] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          {/* Main Top Header Bar */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="p-2 text-[#1a3c2a] hover:bg-[#f4efe6] rounded-full transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#2d2c2a]">
                <Link href="/" className="hover:text-[#1a3c2a] transition-colors">Home</Link>
                <Link href="/products" className="hover:text-[#1a3c2a] transition-colors">Shop All</Link>
                <Link href="/products?category=prepared-foods" className="hover:text-[#1a3c2a] transition-colors">Prepared Foods</Link>
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <Link href="/" className="text-center group">
              <span className="block text-[10px] uppercase tracking-[0.3em] text-[#6e6d69] font-medium">est 2026</span>
              <span
                style={{ fontFamily: "'Playfair Display', serif", color: '#1a3c2a' }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight block group-hover:text-[#2d5a3d] transition-colors leading-tight"
              >
                AFTO-ECO
              </span>
            </Link>

            {/* Right: Login & Cart */}
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#1a3c2a] hover:underline">
                Login
              </button>

              {/* Brown Circular Cart Button (Summerhill style) */}
              <motion.button
                id="navbar-cart-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative bg-[#a67c52] hover:bg-[#8c653f] text-white p-2.5 rounded-2xl shadow-xs transition-colors flex items-center justify-center"
                aria-label="Cart"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>

                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 bg-[#1a3c2a] text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-xs"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Full Width Search Bar */}
          <div className="pt-1">
            <SearchBar compact />
          </div>

          {/* Location Selector Bar */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1a3c2a] pt-1">
            <svg className="w-4 h-4 text-[#1a3c2a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent font-bold cursor-pointer focus:outline-none text-[#1a3c2a] text-xs"
            >
              <option value="Toronto Main Store">Toronto Main Store</option>
              <option value="Aurora Store">Aurora Store</option>
              <option value="Rosedale Market">Rosedale Market</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#e6dfd1] bg-[#faf7f0] px-6 py-4 space-y-3 text-sm font-semibold"
            >
              <Link href="/" className="block text-[#1a1a1a] hover:text-[#1a3c2a]" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="block text-[#1a1a1a] hover:text-[#1a3c2a]" onClick={() => setMobileMenuOpen(false)}>
                Shop All Groceries
              </Link>
              <Link href="/products?category=prepared-foods" className="block text-[#1a1a1a] hover:text-[#1a3c2a]" onClick={() => setMobileMenuOpen(false)}>
                Prepared Foods
              </Link>
              <Link href="/products?category=fruits" className="block text-[#1a1a1a] hover:text-[#1a3c2a]" onClick={() => setMobileMenuOpen(false)}>
                Produce
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {showCart && <CartDrawer />}
    </>
  );
}
