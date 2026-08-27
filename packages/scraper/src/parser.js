const logger = require('./utils/logger');

class ProductParser {
  /**
   * Parse products from page HTML
   * This site uses AngularJS and lazy-loading images
   */
  async parseProductsFromPage(page) {
    logger.info('Parsing products from page');

    try {
      const products = await page.evaluate(() => {
        const items = [];
        
        // Target: product links in the grid
        const productElements = document.querySelectorAll('a[href*="/product/"]');

        productElements.forEach((link, index) => {
          try {
            const productName = link.textContent.trim();
            if (!productName) return;

            // Find the parent product item for more details
            let productItem = link.closest('.hs-product-box') || link.closest('.hs-product-info-wrap') || link.closest('[class*="product"]');
            
            if (!productItem) {
              productItem = link;
            }

            const imgElement = productItem.querySelector('img');
            const imageUrl = imgElement?.getAttribute('src') || '';

            // Get price from the product item
            let price = 0;
            const dollar = productItem.querySelector('.price-dollar')?.textContent?.trim() || '';
            const cents = productItem.querySelector('.price-cents')?.textContent?.trim() || '';
            if (dollar || cents) {
              price = parseFloat(`${dollar}.${cents || '00'}`) || 0;
            } else {
              const priceText = productItem.querySelector('.hs-product-price')?.textContent?.trim() || '';
              price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            }

            // Get description if available
            const description = 
              productItem.querySelector('[data-product-description]')?.textContent?.trim() || 
              productItem.querySelector('.product-description')?.textContent?.trim() || 
              '';

            // Get category from breadcrumb or page context
            const category = document.querySelector('.breadcrumb')?.textContent?.trim() || 'General';

            const product = {
              name: productName,
              price: price,
              description: description,
              category: category,
              subcategory: productName.split(' ')[0], // Fallback
              sku: link.href.split('/product/')[1]?.split('/')[0] || productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
              images: imageUrl ? [imageUrl] : [],
              availability: productItem.querySelector('.out-of-stock') ? 'out_of_stock' : 'in_stock',
            };

            if (product.name && product.price >= 0) {
              items.push(product);
            }
          } catch (error) {
            console.error(`Error parsing product at index ${index}:`, error);
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
