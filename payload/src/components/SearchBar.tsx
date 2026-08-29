'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface Props {
  compact?: boolean;
  defaultValue?: string;
}

export default function SearchBar({ compact, defaultValue = '' }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <motion.div
        animate={{ scale: focused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <input
          id="storefront-search-input"
          type="text"
          value={query}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fresh groceries..."
          className={`w-full bg-[#f4efe6] border ${
            focused ? 'border-[#1a3c2a] shadow-sm bg-white' : 'border-[#e6dfd1] hover:border-[#c5bdaf]'
          } rounded-full pl-4.5 pr-11 text-xs sm:text-sm text-[#1a1a1a] placeholder-[#8f8880] focus:outline-none transition-all duration-200 leading-normal ${
            compact ? 'py-2.5' : 'py-3.5'
          }`}
        />
        <button
          type="submit"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6e6d69] hover:text-[#1a3c2a] transition-colors p-1 flex items-center justify-center"
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </motion.div>
    </form>
  );
}
