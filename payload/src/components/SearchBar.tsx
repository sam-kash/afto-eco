'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

interface Props {
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBar({ defaultValue = '', placeholder = 'Search fresh produce, prepared meals, bakery...' }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center w-full">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#8f8d86] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          id="storefront-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 sm:h-12 bg-white border border-[#eae4d8] focus:border-[#143823] rounded-2xl pl-10 sm:pl-11 pr-24 text-xs sm:text-sm text-[#1c1c1a] placeholder-[#8f8d86] focus:outline-none transition-colors shadow-2xs font-sans"
        />

        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 sm:h-8 px-3.5 bg-[#143823] hover:bg-[#235235] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center"
        >
          Search
        </button>
      </div>
    </form>
  );
}
