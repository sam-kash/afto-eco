import { getPayload } from 'payload';
import config from '@/payload.config';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartWidget from '@/components/AddToCartWidget';

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const payload = await getPayload({ config: await config });
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return res.docs[0] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.title} — AFTO-ECO`,
    description: product.description || `Buy ${product.title} online from AFTO-ECO.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);
  if (!product) notFound();

  const imageUrl = (product.image as any)?.url || null;
  const categoryName = (product.category as any)?.name;
  const categorySlug = (product.category as any)?.slug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs font-semibold uppercase tracking-wider text-[#6e6d69] flex gap-2 items-center">
        <Link href="/" className="hover:text-[#1a3c2a] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#1a3c2a] transition-colors">Products</Link>
        {categoryName && (
          <>
            <span>/</span>
            <Link href={`/products?category=${categorySlug}`} className="hover:text-[#1a3c2a] transition-colors">{categoryName}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#1c1d1b] font-bold">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e6dfd1] shadow-xs grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="aspect-square relative bg-[#f4efe6] rounded-2xl overflow-hidden border border-[#e6dfd1] group">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#c5bdaf]">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth={0.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          {categoryName && (
            <Link
              href={`/products?category=${categorySlug}`}
              className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a3c2a] bg-[#f4efe6] px-3 py-1 rounded-full w-fit mb-4 hover:bg-[#e8ded0] transition-colors"
            >
              {categoryName}
            </Link>
          )}

          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-3xl sm:text-5xl font-extrabold text-[#1c1d1b] mb-4 leading-tight"
          >
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1a3c2a]">
              ${product.price.toFixed(2)}
            </span>
            <span
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider ${
                product.inStock
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}
            >
              {product.inStock ? '✓ In Stock' : 'Out of Stock'}
            </span>
          </div>

          {product.description && (
            <p className="text-[#6e6d69] text-sm leading-relaxed mb-8 border-t border-b border-[#f2ebd9] py-6">
              {product.description}
            </p>
          )}

          {/* SKU */}
          <p className="text-xs font-semibold text-[#8f8880] mb-6">SKU: {product.sku}</p>

          {/* Add to Cart Widget */}
          <AddToCartWidget
            product={{
              id: String(product.id),
              title: product.title,
              slug: product.slug,
              price: product.price,
              image: imageUrl ? { url: imageUrl } : null,
              category: categoryName ? { name: categoryName, slug: categorySlug } : null,
              inStock: product.inStock,
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </div>
  );
}
