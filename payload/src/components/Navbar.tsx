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
      {/* Announcement Bar */}
      <div className="bg-[#143823] text-[#e2ebd4] text-center py-2 px-4 text-[11px] sm:text-xs font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#85c996] animate-pulse" />
        <span>Free local delivery on orders over $75 · Fresh. Organic. Artisanal.</span>
      </div>

      {/* Main Header Container */}
      <header className="bg-white border-b border-[#eae4d8] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          {/* Top Tier */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#6b6a65] font-bold leading-none mb-0.5">
                  Organic Market
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-black text-[#143823] tracking-tight block leading-none group-hover:text-[#235235] transition-colors">
                  AFTO-ECO
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#1c1c1a]">
              <Link href="/" className="hover:text-[#143823] transition-colors">
                Home
              </Link>
              <Link href="/products" className="hover:text-[#143823] transition-colors">
                Shop All
              </Link>
              <Link href="/products?category=prepared-foods" className="hover:text-[#143823] transition-colors">
                Prepared Foods
              </Link>
              <Link href="/products?category=fruits" className="hover:text-[#143823] transition-colors">
                Produce
              </Link>
            </nav>

            {/* Right: Location & Cart */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Location selector */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[#143823] bg-[#f5f2ec] px-3 py-1.5 rounded-xl border border-[#eae4d8]">
                <svg className="w-4 h-4 text-[#143823]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent font-semibold cursor-pointer focus:outline-none text-[#143823]"
                >
                  <option value="Toronto Main Store">Toronto Main Store</option>
                  <option value="Aurora Store">Aurora Store</option>
                  <option value="Rosedale Market">Rosedale Market</option>
                </select>
              </div>

              {/* Cart Button */}
              <button
                id="navbar-cart-btn"
                onClick={() => setShowCart(true)}
                className="relative bg-[#143823] hover:bg-[#235235] text-white px-3.5 py-2 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 text-xs font-bold"
                aria-label="Open cart"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <span className="hidden sm:inline">Cart</span>

                {itemCount > 0 && (
                  <span className="bg-white text-[#143823] text-[11px] font-black rounded-full px-1.5 py-0.2 min-w-[18px] text-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="md:hidden p-2 text-[#143823] hover:bg-[#f5f2ec] rounded-xl transition-colors"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar Row */}
          <div>
            <SearchBar />
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-[#eae4d8] bg-[#faf7f2] px-6 py-4 space-y-3 text-sm font-semibold"
            >
              <Link href="/" className="block text-[#1c1c1a] hover:text-[#143823]" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="block text-[#1c1c1a] hover:text-[#143823]" onClick={() => setMobileMenuOpen(false)}>
                Shop All Groceries
              </Link>
              <Link href="/products?category=prepared-foods" className="block text-[#1c1c1a] hover:text-[#143823]" onClick={() => setMobileMenuOpen(false)}>
                Prepared Foods
              </Link>
              <Link href="/products?category=fruits" className="block text-[#1c1c1a] hover:text-[#143823]" onClick={() => setMobileMenuOpen(false)}>
                Fresh Produce
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {showCart && <CartDrawer />}
    </>
  );
}
