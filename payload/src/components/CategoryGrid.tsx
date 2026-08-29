'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  // Filter out any raw product tags/names if seeded, keep top categories
  const displayCategories = categories.slice(0, 10);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
      {displayCategories.map((cat, idx) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03, duration: 0.25 }}
        >
          <Link
            href={`/products?category=${cat.slug}`}
            id={`category-${cat.slug}`}
            className="flex flex-col items-center justify-center p-5 bg-[#f7f3ea] hover:bg-[#f0e8d7] border border-[#e6dfd1] hover:border-[#1a3c2a] rounded-3xl transition-all duration-300 shadow-2xs hover:shadow-md group h-full"
          >
            {/* Category Icon container */}
            <div className="w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-[#1a3c2a]" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#1c1d1b] text-center leading-snug group-hover:text-[#1a3c2a] transition-colors">
              {cat.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
