const logger = require('./utils/logger');

class ProductParser {
  /**
   * Parse products from page HTML
   * NOTE: Selectors need to be adjusted based on actual website structure
   */
  async parseProductsFromPage(page) {
    logger.info('Parsing products from page');

    try {
      const products = await page.evaluate(() => {
        const items = [];
        
        // NOTE: These selectors are examples - adjust based on actual website HTML
        const productElements = document.querySelectorAll('[data-product]');

        productElements.forEach((element) => {
          try {
            const product = {
              name:
                element.querySelector('[data-product-name]')?.textContent?.trim() || '',
              price: parseFloat(
                element
                  .querySelector('[data-product-price]')
                  ?.textContent?.replace(/[^0-9.]/g, '') || 0
              ),
              description:
                element.querySelector('[data-product-description]')?.textContent?.trim() || '',
              category:
                element.querySelector('[data-product-category]')?.textContent?.trim() || '',
              subcategory:
                element.querySelector('[data-product-subcategory]')?.textContent?.trim() || '',
              sku: element.getAttribute('data-sku') || `SKU-${Date.now()}-${Math.random()}`,
              images: Array.from(
                element.querySelectorAll('[data-product-image] img')
              )
                .map((img) => img.src || img.dataset.src)
                .filter(Boolean),
              availability:
                element.getAttribute('data-availability') || 'in_stock',
            };

            if (product.name && product.price > 0) {
              items.push(product);
            }
          } catch (error) {
            console.error('Error parsing product element:', error);
          }
        });

        return items;
      });

      logger.info(`Parsed ${products.length} products from page`);
      return products;
    } catch (error) {
      logger.error('Failed to parse products from page', { error: error.message });
      throw error;
    }
  }

  /**
   * Group products by category and subcategory
   */
  groupByCategory(products) {
    logger.info('Grouping products by category');

    const grouped = {};

    products.forEach((product) => {
      const category = product.category || 'Uncategorized';
      const subcategory = product.subcategory || 'General';

      if (!grouped[category]) {
        grouped[category] = {};
      }

      if (!grouped[category][subcategory]) {
        grouped[category][subcategory] = [];
      }

      grouped[category][subcategory].push(product);
    });

    return grouped;
  }

  /**
   * Format products for output
   */
  formatForOutput(groupedProducts) {
    logger.info('Formatting products for output');

    const output = [];

    Object.entries(groupedProducts).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, products]) => {
        output.push({
          category,
          subcategory,
          products: products.map((p) => ({
            id: p.sku,
            name: p.name,
            description: p.description,
            price: p.price,
            currency: 'CAD',
            images: p.images,
            availability: p.availability,
            sku: p.sku,
          })),
        });
      });
    });

    logger.info(`Formatted ${output.length} category groups`);
    return output;
  }
}

module.exports = new ProductParser();