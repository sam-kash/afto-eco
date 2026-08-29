'use client';

import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cart, setShowCart, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      cart.forEach((item) => removeFromCart(item.id));
      setCheckedOut(false);
      setShowCart(false);
    }, 2200);
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="cart-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowCart(false)}
      />

      {/* Drawer */}
      <motion.aside
        key="cart-drawer"
        id="cart-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#faf7f0] shadow-2xl flex flex-col border-l border-[#d6cfc0]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2dacb] bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-[#1a3c2a]">
              Your Shopping Cart
            </h2>
            <span className="bg-[#1a3c2a] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>
          <button
            id="cart-close-btn"
            onClick={() => setShowCart(false)}
            className="p-1 text-[#6b6560] hover:text-[#1a1a1a] transition-colors rounded-full hover:bg-[#eae3d5]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-24 text-[#6b6560]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#eee7d8] flex items-center justify-center text-[#1a3c2a]">
                <svg className="w-8 h-8 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <p className="text-base font-medium text-[#1a1a1a] mb-1">Your cart is currently empty</p>
              <p className="text-xs text-[#6b6560]">Add items from our shop to get started!</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <motion.div
                key={String(item.id || item.slug || idx)}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 bg-white rounded-xl p-3 border border-[#e6dfd1] shadow-xs"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-[#f5f0e8]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[#f5f0e8] flex items-center justify-center text-[#c5bdaf] flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1a1a1a] line-clamp-2 leading-snug">{item.title}</p>
                  <p className="text-sm font-bold text-[#1a3c2a] mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#d6cfc0] rounded-full bg-[#faf7f0] px-1 py-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#1a1a1a] hover:bg-[#e6dfd1] transition-colors text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#1a1a1a] hover:bg-[#e6dfd1] transition-colors text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-[#9a9490] hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#e2dacb] bg-white/70 backdrop-blur-md space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#6b6560]">
                <span>Taxes &amp; Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#1a1a1a]">
                <span>Total</span>
                <span className="text-[#1a3c2a]">${total.toFixed(2)}</span>
              </div>
            </div>

            {checkedOut ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1a3c2a] text-white text-center py-4 rounded-xl text-sm font-semibold tracking-wide shadow-md"
              >
                ✓ Order Placed! Thank you.
              </motion.div>
            ) : (
              <motion.button
                id="cart-checkout-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl text-white text-sm font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#1a3c2a' }}
              >
                Proceed to Checkout (${total.toFixed(2)})
              </motion.button>
            )}
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}
