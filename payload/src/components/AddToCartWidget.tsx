'use client';

import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/context/CartContext';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    description?: string;
    image?: { url: string } | null;
    category?: { name: string; slug: string } | null;
    inStock?: boolean;
    stock?: number;
  };
}

export default function AddToCartWidget({ product }: Props) {
  const { addToCart, setShowCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const imageUrl = product.image?.url || null;

  const handleAdd = () => {
    const item: CartItem = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: imageUrl,
      quantity: qty,
      stock: product.stock ?? 100,
    };
    for (let i = 0; i < qty; i++) addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="space-y-5">
      {/* Quantity Selector */}
      <div>
        <label className="block text-xs font-bold text-[#6e6d69] uppercase tracking-[0.15em] mb-2.5">
          Select Quantity
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#d6cfc0] rounded-full bg-[#faf7f0] p-1 shadow-2xs">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full bg-white border border-[#e6dfd1] flex items-center justify-center text-[#1c1d1b] hover:bg-[#e8ded0] transition-colors text-base font-bold"
            >
              −
            </button>
            <span className="text-base font-bold w-10 text-center text-[#1c1d1b]">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-full bg-white border border-[#e6dfd1] flex items-center justify-center text-[#1c1d1b] hover:bg-[#e8ded0] transition-colors text-base font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          id="pdp-add-to-cart-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          disabled={product.inStock === false}
          className={`flex-1 py-4 rounded-full text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md ${
            added ? 'bg-[#3b7a54]' : 'bg-[#1a3c2a] hover:bg-[#2d5a3d]'
          } disabled:opacity-40`}
        >
          {added ? '✓ Added to Cart!' : `Add to Cart — $${(product.price * qty).toFixed(2)}`}
        </motion.button>

        {added && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setShowCart(true)}
            className="px-8 py-4 rounded-full border border-[#1a3c2a] text-[#1a3c2a] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#f4efe6] transition-colors"
          >
            View Cart
          </motion.button>
        )}
      </div>
    </div>
  );
}
