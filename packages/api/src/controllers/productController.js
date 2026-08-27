const DatabaseService = require('../services/db');

class ProductController {
  static async getAll(req, res, next) {
    try {
      const limit = parseInt(req.query.limit || 20);
      const offset = parseInt(req.query.offset || 0);

      const products = await DatabaseService.getProducts(limit, offset);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const product = await DatabaseService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await DatabaseService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;