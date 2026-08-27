# Stage 1: Web Scraper

Extract product data from https://shop.summerhillmarket.com/

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd packages/scraper
npm install
```

### Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env if needed (defaults should work)
```

## Usage

### Run Scraper

```bash
npm run scrape
```

**Output:** `packages/scraper/output/products.json`

### Debug Mode

```bash
npm run scrape:debug
```

## Output Format

The scraper outputs JSON in this format:

```json
[
  {
    "category": "Snacks",
    "subcategory": "Chips",
    "products": [
      {
        "id": "unique_sku",
        "name": "Product Name",
        "description": "Product description",
        "price": 4.99,
        "currency": "CAD",
        "images": ["url1", "url2"],
        "availability": "in_stock"
      }
    ]
  }
]
```

## Troubleshooting

### Scraper Hangs

- Increase `TIMEOUT` in `.env`
- Check internet connection
- Website might be blocking requests

### No Products Found

- Selectors in `src/config.js` might be wrong
- Use browser dev tools to find correct selectors
- Update `WAIT_SELECTOR` and product parsing logic

### Timeout Errors

```bash
# Increase timeout
echo "TIMEOUT=60000" >> .env
```

## How It Works

1. **Initialization:** Launches Puppeteer browser
2. **Navigation:** Goes to target website
3. **Parsing:** Extracts products from page HTML
4. **Pagination:** Follows next page links
5. **Validation:** Checks product data quality
6. **Grouping:** Organizes by category
7. **Output:** Saves as JSON file

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `TARGET_URL` | https://shop.summerhillmarket.com/ | Website to scrape |
| `OUTPUT_PATH` | ./output/products.json | Where to save JSON |
| `HEADLESS` | true | Show browser window |
| `TIMEOUT` | 30000 | Page timeout (ms) |
| `RETRY_ATTEMPTS` | 3 | Number of retries |
| `RETRY_DELAY` | 1000 | Delay between retries (ms) |
| `LOG_LEVEL` | info | Logging verbosity |

## Performance Notes

- First run takes 2-5 minutes depending on product count
- Subsequent runs are faster (Puppeteer cache)
- Scraper handles pagination automatically
- Includes exponential backoff for resilience

## Next Steps

Once scraper runs successfully:

1. Verify `output/products.json` exists
2. Check JSON structure is correct
3. Move to Stage 2: Dagster pipeline