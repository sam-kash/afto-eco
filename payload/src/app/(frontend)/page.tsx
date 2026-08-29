import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryGrid from '@/components/CategoryGrid';
import { mockCategories, mockProducts } from '@/mockData';

function getData() {
  return {
    categories: mockCategories,
    featured: mockProducts,
  };
}

export default async function HomePage() {
  const { categories, featured } = await getData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-xs border border-[#eae4d8] bg-gradient-to-b from-[#f9f5ed] to-[#f0e8d7] p-8 sm:p-12 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#eae4d8] shadow-2xs text-xs font-semibold uppercase tracking-wider text-[#143823]">
            <span className="w-2 h-2 rounded-full bg-[#143823]" />
            Artisanal Groceries · Farm to Table
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-[#143823] tracking-tight leading-tight">
            AFTO-ECO
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#6b6a65] font-medium max-w-lg mx-auto leading-relaxed">
            Curated organic produce, chef-prepared gourmet meals, and pantry essentials delivered fresh to your doorstep.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              id="hero-shop-now-btn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#143823] hover:bg-[#235235] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-sm transition-all"
            >
              <span>Shop All Products</span>
              <span>→</span>
            </Link>
            <Link
              href="/products?category=prepared-foods"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-[#faf7f2] text-[#143823] border border-[#eae4d8] text-xs sm:text-sm font-semibold rounded-2xl shadow-2xs transition-all"
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
            className="flex items-start gap-3.5 p-5 bg-white rounded-2xl border border-[#eae4d8] shadow-2xs"
          >
            <span className="text-2xl p-2.5 rounded-xl bg-[#f5f2ec] flex-shrink-0">{item.icon}</span>
            <div>
              <h3 className="font-sans text-xs sm:text-sm font-bold text-[#143823] mb-0.5">{item.title}</h3>
              <p className="font-sans text-xs text-[#6b6a65] leading-normal font-normal">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae4d8]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b6a65] mb-0.5">Browse Inventory</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
                Shop by Category
              </h2>
            </div>
          </div>

          <CategoryGrid categories={categories.map((c: any) => ({ id: String(c.id), name: c.name, slug: c.slug }))} />
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="space-y-5 pb-8">
          <div className="flex items-center justify-between pb-2 border-b border-[#eae4d8]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b6a65] mb-0.5">Handpicked Selection</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
                Featured Groceries
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#143823] hover:underline"
            >
              Explore All →
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
