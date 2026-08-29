import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          try {
            const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
            
            // Resolve category name
            let categoryName = '';
            if (doc.category) {
              const categoryDoc = await req.payload.findByID({
                collection: 'categories',
                id: typeof doc.category === 'object' ? doc.category.id : doc.category,
              });
              categoryName = categoryDoc?.name || '';
            }

            const response = await fetch(`${esUrl}/products/_doc/${doc.sku}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sku: doc.sku,
                name: doc.title,
                description: doc.description || '',
                price: doc.price,
                currency: 'CAD',
                availability: doc.inStock ? 'in_stock' : 'out_of_stock',
                category_name: categoryName,
              }),
            });
            if (response.ok) {
              console.log(`[Elasticsearch Sync] Indexed product SKU ${doc.sku}`);
            } else {
              console.error(`[Elasticsearch Sync] Failed to index SKU ${doc.sku}. Status: ${response.status}`);
            }
          } catch (error) {
            console.error('[Elasticsearch Sync] Error syncing product to Elasticsearch:', error);
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
          const response = await fetch(`${esUrl}/products/_doc/${doc.sku}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            console.log(`[Elasticsearch Sync] Deleted product SKU ${doc.sku} from index`);
          } else if (response.status !== 404) {
            console.error(`[Elasticsearch Sync] Failed to delete SKU ${doc.sku}. Status: ${response.status}`);
          }
        } catch (error) {
          console.error('[Elasticsearch Sync] Error deleting product from Elasticsearch:', error);
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'stock',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  endpoints: [
    {
      path: '/search',
      method: 'get',
      handler: async (req, res) => {
        const { q, category, sort } = req.query;
        
        const query: any = {};
        
        if (q) {
          query.title = { $regex: q, $options: 'i' };
        }
        
        if (category) {
          query.category = category;
        }

        const products = await req.payload.find({
          collection: 'products',
          where: query,
          sort: sort === 'price_asc' ? { price: 1 } : { price: -1 },
        });

        res.json(products);
      },
    },
  ],
};