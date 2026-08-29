import { getPayload } from 'payload';
import config from '@/payload.config';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const PAGE_SIZE = 24;

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}

// Fetch from Elasticsearch via Node API when user searches
async function searchViaElasticsearch(q: string, category?: string, sort?: string, page = 1) {
  const params = new URLSearchParams({ q });
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);
  params.set('page', String(page));
  params.set('limit', String(PAGE_SIZE));

  try {
    const res = await fetch(`${API_URL}/api/search?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return { hits: data.data?.hits || [], total: data.data?.total || 0, fromSearch: true };
  } catch {
    return { hits: [], total: 0, fromSearch: true };
  }
}

// Fetch from Payload CMS when browsing (no search query)
async function browsePayload(category?: string, sort?: string, page = 1) {
  const payload = await getPayload({ config: await config });

  const where: any = {};
  if (category) {
    const catRes = await payload.find({
      collection: 'categories',
      where: { slug: { equals: category } },
      limit: 1,
    });
    if (catRes.docs.length > 0) {
      where.category = { equals: catRes.docs[0].id };
    }
  }

  let sortField = '-createdAt';
  if (sort === 'price_asc') sortField = 'price';
  if (sort === 'price_desc') sortField = '-price';

  const res = await payload.find({
    collection: 'products',
    where,
    sort: sortField,
    limit: PAGE_SIZE,
    page,
    depth: 2,
  });

  return { docs: res.docs, total: res.totalDocs, fromSearch: false };
}

async function getCategories() {
  const payload = await getPayload({ config: await config });
  const res = await payload.find({ collection: 'categories', limit: 50, sort: 'name' });
  return res.docs;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q?.trim() || '';
  const category = resolvedParams.category || '';
  const sort = resolvedParams.sort || '';
  const page = parseInt(resolvedParams.page || '1', 10);

  const [categoriesResult, productsResult] = await Promise.all([
    getCategories(),
    q
      ? searchViaElasticsearch(q, category, sort, page)
      : browsePayload(category, sort, page),
  ]);

  const products = productsResult.fromSearch
    ? (productsResult as any).hits
    : (productsResult as any).docs;

  const total = productsResult.total;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e6dfd1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#6e6d69] mb-1">
            {productsResult.fromSearch ? 'Elasticsearch Powered' : 'Market Inventory'}
          </p>
          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl sm:text-5xl font-extrabold text-[#1a3c2a]"
          >
            {q ? `Results for "${q}"` : category ? categoriesResult.find((c: any) => c.slug === category)?.name || 'Products' : 'All Groceries'}
          </h1>
          <p className="text-[#6e6d69] text-xs sm:text-sm mt-1">
            Showing {products.length} of {total} item{total !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchBar defaultValue={q} />
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#e6dfd1]">
        {/* Category Pills Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <Link
            href={`/products?${new URLSearchParams({ ...(q && { q }), ...(sort && { sort }) }).toString()}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all duration-200 whitespace-nowrap ${
              !category
                ? 'bg-[#1a3c2a] text-white border-[#1a3c2a] shadow-xs'
                : 'bg-white text-[#1c1d1b] border-[#e6dfd1] hover:border-[#1a3c2a]'
            }`}
          >
            All Products
          </Link>
          {categoriesResult.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/products?${new URLSearchParams({ ...(q && { q }), category: cat.slug, ...(sort && { sort }) }).toString()}`}
              id={`filter-${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all duration-200 whitespace-nowrap ${
                category === cat.slug
                  ? 'bg-[#1a3c2a] text-white border-[#1a3c2a] shadow-xs'
                  : 'bg-white text-[#1c1d1b] border-[#e6dfd1] hover:border-[#1a3c2a]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sort Pills */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold text-[#6e6d69] uppercase tracking-wider">Sort:</span>
          {[
            { label: 'Price: Low → High', value: 'price_asc' },
            { label: 'Price: High → Low', value: 'price_desc' },
          ].map((s) => (
            <Link
              key={s.value}
              href={`/products?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), sort: s.value }).toString()}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                sort === s.value
                  ? 'bg-[#1a3c2a] text-white border-[#1a3c2a]'
                  : 'bg-white text-[#1c1d1b] border-[#e6dfd1] hover:border-[#1a3c2a]'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#e6dfd1] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#f4efe6] flex items-center justify-center text-[#1a3c2a]">
            <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#1a3c2a]">
            No matching products found
          </h3>
          <p className="text-sm text-[#6e6d69] max-w-sm mx-auto">
            Try checking for spelling errors or clearing your current search filter.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 bg-[#1a3c2a] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all"
          >
            Reset All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {products.map((product: any) => {
            const normalised = productsResult.fromSearch
              ? {
                  id: product.id || product._id || product.sku,
                  title: product.name || product._source?.name,
                  slug: product.sku || product._source?.sku,
                  price: product.price ?? product._source?.price ?? 0,
                  image: (product.images?.[0] || product._source?.images?.[0])
                    ? { url: product.images?.[0] || product._source?.images?.[0] }
                    : null,
                  category: (product.category_name || product._source?.category_name)
                    ? { name: product.category_name || product._source?.category_name }
                    : null,
                  inStock: (product.availability || product._source?.availability) === 'in_stock',
                }
              : product;
            return <ProductCard key={normalised.id} product={normalised} />;
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-6 pb-12">
          {page > 1 && (
            <Link
              href={`/products?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(sort && { sort }), page: String(page - 1) }).toString()}`}
              className="px-6 py-2.5 rounded-full bg-white border border-[#e6dfd1] text-xs font-bold uppercase tracking-wider text-[#1a3c2a] hover:border-[#1a3c2a] shadow-xs transition-all"
            >
              ← Previous
            </Link>
          )}
          <span className="text-xs font-semibold text-[#6e6d69] bg-white px-4 py-2.5 rounded-full border border-[#e6dfd1]">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/products?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(sort && { sort }), page: String(page + 1) }).toString()}`}
              className="px-6 py-2.5 rounded-full bg-white border border-[#e6dfd1] text-xs font-bold uppercase tracking-wider text-[#1a3c2a] hover:border-[#1a3c2a] shadow-xs transition-all"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
