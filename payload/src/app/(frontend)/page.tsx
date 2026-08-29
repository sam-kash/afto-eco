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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* Premium Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-sm border border-[#eae4d8] bg-gradient-to-b from-[#f9f5ed] to-[#f2eae0] p-8 sm:p-14 text-center">
        {/* Soft background glow circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#143823]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#eae4d8] shadow-2xs text-xs font-bold uppercase tracking-wider text-[#143823]">
            <span className="w-2 h-2 rounded-full bg-[#143823]" />
            Artisanal Groceries · Farm to Table
          </div>

          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-[#143823] tracking-tight leading-[1.08]"
          >
            AFTO-ECO
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#6b6a65] font-medium max-w-lg mx-auto leading-relaxed">
            Curated organic produce, chef-prepared gourmet meals, and pantry essentials delivered fresh to your doorstep.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              id="hero-shop-now-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#143823] hover:bg-[#235235] text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Shop All Products</span>
              <span>→</span>
            </Link>
            <Link
              href="/products?category=prepared-foods"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-[#faf7f2] text-[#143823] border border-[#eae4d8] text-sm font-semibold rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              Prepared Meals
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Value Props Ribbon */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: '100% Organic Certified',
            desc: 'Directly sourced from verified local farms and eco-friendly growers.',
            icon: '🌱',
          },
          {
            title: 'Same-Day Delivery',
            desc: 'Order before 2 PM for doorstep delivery anywhere in the city.',
            icon: '🚚',
          },
          {
            title: 'Chef-Prepared Daily',
            desc: 'Handcrafted meals made fresh daily in our local kitchen.',
            icon: '👨‍🍳',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-[#eae4d8] shadow-2xs"
          >
            <span className="text-3xl p-3 rounded-2xl bg-[#f5f2ec]">{item.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-[#143823] mb-1">{item.title}</h3>
              <p className="text-xs text-[#6b6a65] leading-relaxed font-normal">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae4d8]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6a65] mb-1">Browse Inventory</p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl sm:text-3xl font-bold text-[#143823]"
              >
                Shop by Category
              </h2>
            </div>
          </div>

          <CategoryGrid categories={categories.map((c: any) => ({ id: String(c.id), name: c.name, slug: c.slug }))} />
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="space-y-6 pb-12">
          <div className="flex items-center justify-between pb-3 border-b border-[#eae4d8]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b6a65] mb-1">Handpicked Selection</p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl sm:text-3xl font-bold text-[#143823]"
              >
                Featured Groceries
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-[#143823] hover:underline"
            >
              Explore All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {featured.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
