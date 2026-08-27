import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">Thank you for your purchase</p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}