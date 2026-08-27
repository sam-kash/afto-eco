import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { cart, setShowCart } = useCart();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <motion.h1 className="text-2xl font-bold text-primary" whileHover={{ scale: 1.05 }}>
            ∋ AFTO-ECO
          </motion.h1>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-primary transition">
            Home
          </Link>
          <Link href="/search" className="text-gray-600 hover:text-primary transition">
            Explore
          </Link>

          <motion.button
            onClick={() => setShowCart(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}