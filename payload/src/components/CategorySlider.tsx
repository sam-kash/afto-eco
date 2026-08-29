'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#e6dfd1] shadow-md flex items-center justify-center text-[#1a3c2a] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
        aria-label="Scroll left"
      >
        ‹
      </button>

      {/* Categories Row */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto pb-4 pt-1 scrollbar-hide scroll-smooth"
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.3 }}
          >
            <Link
              href={`/products?category=${cat.slug}`}
              id={`category-${cat.slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-2.5 bg-white border border-[#e6dfd1] hover:border-[#1a3c2a] rounded-2xl px-5 py-4 min-w-[105px] sm:min-w-[120px] transition-all duration-300 shadow-2xs hover:shadow-lg group/item"
            >
              <div className="w-12 h-12 rounded-full bg-[#f4efe6] flex items-center justify-center group-hover/item:bg-[#1a3c2a] group-hover/item:scale-110 transition-all duration-300">
                <svg className="w-5 h-5 text-[#1a3c2a] group-hover/item:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#1c1d1b] text-center leading-tight group-hover/item:text-[#1a3c2a] transition-colors">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#e6dfd1] shadow-md flex items-center justify-center text-[#1a3c2a] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}
