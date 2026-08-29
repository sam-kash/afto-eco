'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

interface Props {
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBar({ defaultValue = '', placeholder = 'Search fresh produce, prepared meals, bakery...' }: Props) {
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
      <div
        className={`relative flex items-center w-full bg-white border ${
          focused ? 'border-[#143823] ring-3 ring-[#143823]/10 shadow-md' : 'border-[#eae4d8] hover:border-[#c8bdab]'
        } rounded-2xl transition-all duration-200 overflow-hidden`}
      >
        <span className="pl-4 text-[#6b6a65] flex items-center justify-center pointer-events-none">
          <svg className="w-5 h-5 text-[#143823]/70" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>

        <input
          id="storefront-search-input"
          type="text"
          value={query}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3.5 pl-3 pr-12 text-sm text-[#1c1c1a] placeholder-[#8f8d86] bg-transparent focus:outline-none leading-normal font-normal"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-12 text-[#99968e] hover:text-[#1c1c1a] p-1.5 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 px-3 py-1.5 bg-[#143823] hover:bg-[#235235] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          aria-label="Submit Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
