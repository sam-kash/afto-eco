import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { checkoutService } from '@/services/api';
import { useRouter } from 'next/router';

export default function Checkout() {
  const { cart, total } = useCart();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!email || cart.length === 0) return;

    setLoading(true);
    try {
      const res = await checkoutService.createSession(cart, email);
      window.location.href = res.data.data.url;
    } catch (error) {
      console.error('Checkout failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-8">
        Checkout
      </motion.h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-2">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </motion.button>
        </form>
      )}
    </div>
  );
}