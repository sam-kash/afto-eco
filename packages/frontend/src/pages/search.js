import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { searchService } from '@/services/api';

export default function Search() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { q } = router.query;

  useEffect(() => {
    if (q) {
      setLoading(true);
      searchService
        .search(q)
        .then((res) => {
          setResults(res.data.data.hits);
          setLoading(false);
        });
    }
  }, [q]);

  return (
    <div>
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No products found</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}