import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { productService } from '@/services/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const PAGE_SIZE = 12;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    productService.getAll(PAGE_SIZE, (page - 1) * PAGE_SIZE).then((res) => {
      setProducts(res.data.data);
      setLoading(false);
    });
  }, [page]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Market</h1>
          <p className="text-lg mb-8 opacity-90">Discover fresh, quality products</p>
          <SearchBar />
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Featured Products
        </motion.h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={products.length < PAGE_SIZE || loading}
            className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
