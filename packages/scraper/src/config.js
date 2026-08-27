require('dotenv').config();

module.exports = {
  // Scraper Target
  TARGET_URL: process.env.TARGET_URL || 'https://shop.summerhillmarket.com/',
  OUTPUT_PATH: process.env.OUTPUT_PATH || './output/products.json',

  // Puppeteer Settings
  HEADLESS: process.env.HEADLESS !== 'false',
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000'),
  RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '1000'),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === 'true',

  // Scraper Specific
  WAIT_SELECTOR: '.product-item', // Adjust based on website structure
  PAGINATION_SELECTOR: 'a.next-page', // Adjust based on website structure
  MAX_PRODUCTS: process.env.MAX_PRODUCTS ? parseInt(process.env.MAX_PRODUCTS) : null,
};