require('dotenv').config();

module.exports = {
  // Scraper Target
  TARGET_URL: process.env.TARGET_URL || 'https://shop.summerhillmarket.com/',
  OUTPUT_PATH: process.env.OUTPUT_PATH || './output/products.json',

  // Puppeteer Settings
  HEADLESS: process.env.HEADLESS !== 'false',
  TIMEOUT: parseInt(process.env.TIMEOUT || '60000'), // Increased for lazy loading
  RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '2000'),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === 'true',

  // Scraper Specific - Updated for this website
  WAIT_SELECTOR: 'a[href*="/product/"]', // Wait for product links to appear
  PAGINATION_SELECTOR: 'a[rel="next"]', // Try to find next page button
  MAX_PRODUCTS: process.env.MAX_PRODUCTS ? parseInt(process.env.MAX_PRODUCTS) : null,
  
  // Lazy loading wait time
  LAZY_LOAD_WAIT: 2000, // Wait 2 seconds for lazy images to load
};
