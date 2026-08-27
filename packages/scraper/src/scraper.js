// main logic for connecting and scraping 

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const parser = require('./parser');
const { retryWithExponentialBackoff } = require('./utils/retry');
const { validateProductData } = require('./utils/validator');

class WebScraper {
  constructor() {
    this.browser = null;
    this.allProducts = [];
  }

  async initialize() {
    logger.info('Initializing Puppeteer browser');

    try {
      this.browser = await puppeteer.launch({
        headless: config.HEADLESS,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });
      logger.info('Browser initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize browser', { error: error.message });
      throw error;
    }
  }

  async scrapeWithRetry() {
    return retryWithExponentialBackoff(
      () => this.scrape(),
      config.RETRY_ATTEMPTS,
      config.RETRY_DELAY
    );
  }

  async scrape() {
    logger.info('Starting scrape', { url: config.TARGET_URL });

    const page = await this.browser.newPage();
    page.setDefaultTimeout(config.TIMEOUT);

    try {
      // Navigate to website
      logger.info('Navigating to website');
      await page.goto(config.TARGET_URL, {
        waitUntil: 'networkidle2',
      });

      // Scrape all pages
      let pageCount = 0;
      let hasNextPage = true;

      while (hasNextPage && (!config.MAX_PRODUCTS || this.allProducts.length < config.MAX_PRODUCTS)) {
        pageCount++;
        logger.info(`Scraping page ${pageCount}`);

        try {
          // Wait for products to load
          await page.waitForSelector(config.WAIT_SELECTOR, {
            timeout: 10000,
          }).catch(() => {
            logger.warn('Product selector not found, trying to continue');
          });

          // Parse products from current page
          const pageProducts = await parser.parseProductsFromPage(page);
          this.allProducts.push(...pageProducts);

          logger.info(`Page ${pageCount}: Found ${pageProducts.length} products`, {
            totalProducts: this.allProducts.length,
          });

          // Check for next page button
          const nextPageButton = await page.$(config.PAGINATION_SELECTOR);
          
          if (nextPageButton && (!config.MAX_PRODUCTS || this.allProducts.length < config.MAX_PRODUCTS)) {
            await page.click(config.PAGINATION_SELECTOR);
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            logger.info('Navigated to next page');
          } else {
            hasNextPage = false;
            logger.info('No more pages to scrape');
          }
        } catch (error) {
          logger.warn(`Error on page ${pageCount}, stopping pagination`, {
            error: error.message,
          });
          hasNextPage = false;
        }
      }

      logger.info('Scraping complete', {
        totalPages: pageCount,
        totalProducts: this.allProducts.length,
      });
    } catch (error) {
      logger.error('Scraping failed', { error: error.message });
      throw error;
    } finally {
      await page.close();
    }
  }

  async saveToJson() {
    logger.info('Saving products to JSON');

    try {
      // Validate products
      const validation = validateProductData(this.allProducts);
      if (!validation.isValid) {
        logger.warn('Validation warnings', { errors: validation.errors });
      }

      // Group and format
      const groupedProducts = parser.groupByCategory(this.allProducts);
      const formattedOutput = parser.formatForOutput(groupedProducts);

      // Ensure output directory exists
      const outputDir = path.dirname(config.OUTPUT_PATH);
      await fs.mkdir(outputDir, { recursive: true });

      // Write to file
      await fs.writeFile(
        config.OUTPUT_PATH,
        JSON.stringify(formattedOutput, null, 2)
      );

      logger.info('Products saved successfully', {
        path: config.OUTPUT_PATH,
        categories: formattedOutput.length,
        totalProducts: this.allProducts.length,
      });

      return config.OUTPUT_PATH;
    } catch (error) {
      logger.error('Failed to save products', { error: error.message });
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      logger.info('Browser closed');
    }
  }
}

async function main() {
  const scraper = new WebScraper();

  try {
    await scraper.initialize();
    await scraper.scrapeWithRetry();
    const outputPath = await scraper.saveToJson();
    logger.info('Scraping job completed successfully', { outputPath });
  } catch (error) {
    logger.error('Scraping job failed', { error: error.message });
    process.exit(1);
  } finally {
    await scraper.close();
  }
}

// Run if this is the main module
if (require.main === module) {
  main();
}

module.exports = WebScraper;