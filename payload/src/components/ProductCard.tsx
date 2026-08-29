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
    id: String(product.id || product.slug),
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
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#eae4d8] hover:border-[#143823]/40 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden p-3 sm:p-4">
      {/* Product Image Frame */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[#f5f2ec] rounded-2xl overflow-hidden mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#c8bdab]">
            <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}

        {/* Category Pill Tag */}
        {product.category?.name && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-white/95 backdrop-blur-md text-[#143823] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs border border-black/5">
              {product.category.name}
            </span>
          </div>
        )}
      </Link>

      {/* Title & Info */}
      <div className="flex flex-col flex-1 justify-between space-y-3 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-[#1c1c1a] leading-snug line-clamp-2 group-hover:text-[#143823] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f2eae0]">
          <div>
            <span className="text-xs text-[#6b6a65] block font-medium">Price</span>
            <span className="text-sm sm:text-base font-extrabold text-[#143823]">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <motion.button
            id={`add-to-cart-${product.id}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleAdd}
            disabled={product.inStock === false}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
              added
                ? 'bg-[#34704b] text-white'
                : 'bg-[#143823] hover:bg-[#235235] text-white'
            } disabled:opacity-40`}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? (
              <>
                <span>✓</span>
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <span>+</span>
                <span>Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
