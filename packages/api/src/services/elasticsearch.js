const esClient = require('../config/elasticsearch');

class ElasticsearchService {
  /**
   * Search products
   */
  static async searchProducts(query, filters = {}) {
    try {
      const must = [];

      // Text search
      if (query && query.trim()) {
        must.push({
          multi_match: {
            query,
            fields: ['name^2', 'description'],
            fuzziness: 'AUTO',
          },
        });
      }

      // Category filter
      if (filters.category) {
        must.push({
          term: {
            'category_name.keyword': filters.category,
          },
        });
      }

      // Availability filter
      if (filters.availability) {
        must.push({
          term: {
            availability: filters.availability,
          },
        });
      }

      // Price range filter
      const range = {};
      if (filters.minPrice) range.gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) range.lte = parseFloat(filters.maxPrice);
      if (Object.keys(range).length > 0) {
        must.push({ range: { price: range } });
      }

      // Build sort
      const sort = [];
      if (filters.sort === 'price_asc') sort.push({ price: 'asc' });
      if (filters.sort === 'price_desc') sort.push({ price: 'desc' });
      if (filters.sort === 'newest') sort.push({ created_at: 'desc' });

      const searchBody = {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
          },
        },
      };

      if (sort.length > 0) {
        searchBody.sort = sort;
      }

      const result = await esClient.search({
        index: 'products',
        body: searchBody,
        size: filters.limit || 20,
        from: filters.offset || 0,
      });

      return {
        hits: result.hits.hits.map((hit) => ({
          id: hit._id,
          ...hit._source,
        })),
        total: result.hits.total.value,
      };
    } catch (error) {
      console.error('Elasticsearch error:', error);
      throw error;
    }
  }

  /**
   * Get product by SKU
   */
  static async getProductBySku(sku) {
    try {
      const result = await esClient.search({
        index: 'products',
        body: {
          query: {
            term: {
              'sku.keyword': sku,
            },
          },
        },
      });

      if (result.hits.hits.length > 0) {
        return result.hits.hits[0]._source;
      }
      return null;
    } catch (error) {
      console.error('Elasticsearch error:', error);
      throw error;
    }
  }
}

module.exports = ElasticsearchService;