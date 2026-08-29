import { getPayload } from 'payload';
import config from '@/payload.config';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryGrid from '@/components/CategoryGrid';

async function getData() {
  const payload = await getPayload({ config: await config });

  const [categoriesRes, featuredRes] = await Promise.all([
    payload.find({ collection: 'categories', limit: 30, sort: 'name' }),
    payload.find({
      collection: 'products',
      where: { featured: { equals: true } },
      limit: 12,
      depth: 2,
    }),
  ]);

  return {
    categories: categoriesRes.docs,
    featured: featuredRes.docs,
  };
}

export default async function HomePage() {
  const { categories, featured } = await getData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Summerhill Hero Image Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-sm border border-[#e6dfd1] bg-[#f0e8d7] min-h-[220px] sm:min-h-[300px] flex items-center justify-center p-8 text-center">
        {/* Background decorative gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #ebe2d3 70%, #d8caa7 100%)',
          }}
        />

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#1a3c2a] bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#d6cfc0]">
            Fresh. Local. Delivered.
          </span>

          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl sm:text-6xl font-black text-[#1a3c2a] leading-tight"
          >
            AFTO-ECO
          </h1>

          <p className="text-xs sm:text-sm font-medium text-[#6e6d69] max-w-md mx-auto">
            Market-fresh produce, artisanal bakery, and chef-prepared foods delivered to your door.
          </p>
        </div>
      </section>

      {/* Categories Grid (Summerhill 2-row layout) */}
      {categories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#1a3c2a]"
            >
              Shop by Category
            </h2>
          </div>

          <CategoryGrid categories={categories.map((c: any) => ({ id: String(c.id), name: c.name, slug: c.slug }))} />
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="space-y-4 pb-12">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd1]">
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#1a3c2a]"
            >
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-xs font-bold text-[#1a3c2a] tracking-wider uppercase border-b border-[#1a3c2a] pb-0.5 hover:opacity-70 transition-opacity"
            >
              See All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {featured.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
