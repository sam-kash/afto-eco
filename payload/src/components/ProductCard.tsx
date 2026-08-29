'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/context/CartContext';

interface Props {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    image?: { url: string } | null;
    category?: { name: string } | null;
    inStock?: boolean;
    stock?: number;
  };
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const imageUrl = product.image?.url || null;

  const cartItem: CartItem = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    image: imageUrl,
    quantity: 1,
    stock: product.stock ?? 100,
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl border border-[#e6dfd1] hover:border-[#1a3c2a] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[#f5f0e8] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#c5bdaf]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}

        {/* Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
          {product.category?.name && (
            <span className="bg-white/90 backdrop-blur-md text-[#1a3c2a] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-black/5">
              {product.category.name}
            </span>
          )}
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-3.5 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-[#1c1d1b] line-clamp-2 leading-snug group-hover:text-[#1a3c2a] transition-colors mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f2ebd9]">
          <span className="text-sm sm:text-base font-bold text-[#1a3c2a]">
            ${product.price.toFixed(2)}
          </span>

          <motion.button
            id={`add-to-cart-${product.id}`}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            disabled={product.inStock === false}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-medium transition-all shadow-sm ${
              added ? 'bg-[#3b7a54]' : 'bg-[#1a3c2a] hover:bg-[#2d5a3d]'
            } disabled:opacity-40`}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? '✓' : '+'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
