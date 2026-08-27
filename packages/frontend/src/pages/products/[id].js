import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { productService } from '@/services/api';
import { useCart } from '@/hooks/useCart';

export default function ProductDetail() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      productService.getById(id).then((res) => setProduct(res.data.data));
    }
  }, [id]);

  if (!product) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-sm text-gray-500 uppercase">{product.category}</p>
          <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="text-3xl font-bold text-primary mb-8">${parseFloat(product.price).toFixed(2)}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}