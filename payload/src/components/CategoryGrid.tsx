'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  // Filter out any raw tag names, keep top 10 categories
  const displayCategories = categories.slice(0, 10);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {displayCategories.map((cat, idx) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03, duration: 0.25 }}
        >
          <Link
            href={`/products?category=${cat.slug}`}
            id={`category-${cat.slug}`}
            className="flex flex-col items-center justify-center p-6 bg-white hover:bg-[#faf7f2] border border-[#eae4d8] hover:border-[#143823] rounded-3xl transition-all duration-300 shadow-2xs hover:shadow-lg group text-center h-full space-y-3"
          >
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-[#f4efe6] group-hover:bg-[#143823] flex items-center justify-center transition-all duration-300 group-hover:scale-108 shadow-2xs">
              <svg className="w-7 h-7 text-[#143823] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>

            {/* Category Title */}
            <span className="text-xs sm:text-sm font-bold text-[#1c1c1a] group-hover:text-[#143823] transition-colors leading-tight">
              {cat.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
