import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Load env variables
dotenv.config({ path: path.resolve(dirname, '../.env') });

// Retry helper
async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 1) throw err;
    console.log(
      `[Retry] Operation failed. Retrying in ${delay}ms... (${retries - 1} left). Error: ${
        (err as Error).message
      }`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
}

// Helper to create a fallback placeholder media item
async function createFallbackMedia(payload: any): Promise<string> {
  const existing = await payload.find({
    collection: 'media',
    where: {
      originalUrl: { equals: 'fallback-placeholder' },
    },
    limit: 1,
  });

  if (existing.docs && existing.docs.length > 0) {
    return existing.docs[0].id;
  }

  console.log('Uploading default fallback media item...');
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="#F4EFE6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#1E3F20">No Image</text></svg>`;
  const buffer = Buffer.from(fallbackSvg);

  const mediaDoc = await payload.create({
    collection: 'media',
    data: {
      alt: 'Placeholder Image',
      originalUrl: 'fallback-placeholder',
    },
    file: {
      data: buffer,
      name: 'placeholder.svg',
      mimetype: 'image/svg+xml',
      size: buffer.length,
    },
  });

  return mediaDoc.id;
}

// Helper to get or upload media idempotently
async function getOrCreateMedia(payload: any, imageUrl: string, alt: string): Promise<string | null> {
  try {
    // Check if media already exists
    const existingMedia = await payload.find({
      collection: 'media',
      where: {
        originalUrl: { equals: imageUrl },
      },
      limit: 1,
    });

    if (existingMedia.docs && existingMedia.docs.length > 0) {
      return existingMedia.docs[0].id;
    }

    // Otherwise download and upload
    console.log(`Downloading remote image: ${imageUrl}`);
    const response = await retry(async () => {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      return res;
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get clean filename
    const urlPath = new URL(imageUrl).pathname;
    let originalFilename = path.basename(urlPath);
    if (!originalFilename || !originalFilename.includes('.')) {
      originalFilename = `image-${Date.now()}.jpg`;
    }
    const ext = path.extname(originalFilename) || '.jpg';
    const filename = `scraped-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;

    console.log(`Uploading media document for: ${originalFilename}`);
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: alt,
        originalUrl: imageUrl,
      },
      file: {
        data: buffer,
        name: filename,
        mimetype: response.headers.get('content-type') || 'image/jpeg',
        size: buffer.length,
      },
    });

    return mediaDoc.id;
  } catch (error) {
    console.warn(`Failed to process image ${imageUrl}, using placeholder. Error:`, (error as Error).message);
    return null;
  }
}

const seed = async () => {
  console.log('🚀 Initializing Payload CMS...');
  const { getPayload } = await import('payload');
  const configModule = await import('../src/payload.config');
  const payloadConfig = await configModule.default;
  const payload = await getPayload({ config: payloadConfig });

  const productsJsonPath = path.resolve(dirname, '../../packages/scraper/output/products.json');
  if (!fs.existsSync(productsJsonPath)) {
    console.error(`❌ Scraper output file not found at: ${productsJsonPath}`);
    process.exit(1);
  }

  console.log(`Loading products from: ${productsJsonPath}`);
  const productsJson = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
  const categoryMap: { [key: string]: string } = {};

  // 1. Create default fallback image
  const fallbackMediaId = await createFallbackMedia(payload);

  // 2. Process products
  console.log('Starting product ingestion...');
  let totalProductsCount = 0;
  let createdCount = 0;
  let updatedCount = 0;

  for (const group of productsJson) {
    const rawCategoryName = group.subcategory || 'General';
    const categoryName = rawCategoryName.charAt(0).toUpperCase() + rawCategoryName.slice(1);
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Resolve category ID
    let categoryId = categoryMap[categoryName];
    if (!categoryId) {
      const existingCat = await payload.find({
        collection: 'categories',
        where: {
          slug: { equals: categorySlug },
        },
        limit: 1,
      });

      if (existingCat.docs && existingCat.docs.length > 0) {
        categoryId = existingCat.docs[0].id;
        categoryMap[categoryName] = categoryId;
      } else {
        const createdCat = await payload.create({
          collection: 'categories',
          data: {
            name: categoryName,
            slug: categorySlug,
          },
        });
        categoryId = createdCat.id;
        categoryMap[categoryName] = categoryId;
        console.log(`Created dynamic category "${categoryName}"`);
      }
    }

    for (const product of group.products) {
      totalProductsCount++;
      const productSlug = `${product.id}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      try {
        // Handle images
        let mediaId: string | null = null;
        if (product.images && product.images.length > 0 && product.images[0]) {
          mediaId = await getOrCreateMedia(payload, product.images[0], product.name);
        }
        
        // Final media ID fallback
        const finalMediaId = mediaId || fallbackMediaId;

        // Check if product with this SKU already exists
        const existingProduct = await payload.find({
          collection: 'products',
          where: {
            sku: { equals: product.sku || product.id },
          },
          limit: 1,
        });

        // Set featured flag for every 5th product
        const featured = totalProductsCount % 5 === 0;

        const productData = {
          title: product.name,
          slug: productSlug,
          description: product.description || '',
          price: parseFloat(product.price) || 0.99,
          category: categoryId,
          sku: product.sku || product.id,
          inStock: product.availability === 'in_stock',
          stock: 100,
          image: finalMediaId,
          featured: featured,
        };

        if (existingProduct.docs && existingProduct.docs.length > 0) {
          // Update
          const existingId = existingProduct.docs[0].id;
          await payload.update({
            collection: 'products',
            id: existingId,
            data: productData,
          });
          updatedCount++;
          console.log(`[Update] Product SKU: ${productData.sku} (${product.name})`);
        } else {
          // Create
          await payload.create({
            collection: 'products',
            data: productData,
          });
          createdCount++;
          console.log(`[Create] Product SKU: ${productData.sku} (${product.name})`);
        }
      } catch (err) {
        console.error(`❌ Failed to ingest product SKU: ${product.sku || product.id} (${product.name}). Error:`, (err as Error).message);
      }
    }
  }

  console.log('\n==============================================');
  console.log(`✅ Ingestion completed!`);
  console.log(`Processed: ${totalProductsCount} products`);
  console.log(`Created: ${createdCount}`);
  console.log(`Updated: ${updatedCount}`);
  console.log('==============================================\n');
  process.exit(0);
};

seed().catch((error) => {
  console.error('❌ Ingestion script crashed:', error);
  process.exit(1);
});