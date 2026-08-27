const ElasticsearchService = require('../services/elasticsearch');

class SearchController {
  static async search(req, res, next) {
    try {
      const { q, category, minPrice, maxPrice, sort, limit, offset } = req.query;

      const filters = {
        category,
        minPrice,
        maxPrice,
        sort,
        limit: parseInt(limit || 20),
        offset: parseInt(offset || 0),
      };

      const results = await ElasticsearchService.searchProducts(q, filters);
      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SearchController;