const pool = require('../config/database');

class DatabaseService {
  /**
   * Get all products with pagination
   */
  static async getProducts(limit = 20, offset = 0) {
    try {
      const query = `
        SELECT 
          p.id, p.sku, p.name, p.description, p.price, p.currency,
          p.availability, p.images, c.name as category, sc.name as subcategory
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  static async getProductById(productId) {
    try {
      const query = `
        SELECT 
          p.id, p.sku, p.name, p.description, p.price, p.currency,
          p.availability, p.images, c.name as category, sc.name as subcategory
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [productId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  static async getCategories() {
    try {
      const query = `SELECT id, name FROM categories ORDER BY name`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  /**
   * Create order
   */
  static async createOrder(data) {
    try {
      const query = `
        INSERT INTO orders (stripe_session_id, stripe_payment_intent_id, total_amount, currency, status, customer_email)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, stripe_session_id, total_amount, status
      `;
      const result = await pool.query(query, [
        data.sessionId,
        data.paymentIntentId,
        data.totalAmount,
        data.currency || 'CAD',
        data.status || 'pending',
        data.email,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId) {
    try {
      const query = `SELECT * FROM orders WHERE id = $1`;
      const result = await pool.query(query, [orderId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

module.exports = DatabaseService;