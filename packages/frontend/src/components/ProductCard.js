import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-primary transition line-clamp-2 mt-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-primary">${parseFloat(product.price).toFixed(2)}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary transition"
          >
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}