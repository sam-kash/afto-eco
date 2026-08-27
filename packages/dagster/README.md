# Stage 2: Dagster Data Pipeline

Orchestrate data ingestion from scraper into PostgreSQL and Elasticsearch.

## Setup

### Prerequisites

- Python 3.9+
- pip
- PostgreSQL running (via Docker)
- Elasticsearch running (via Docker)

### Installation

```bash
cd packages/dagster

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

```bash
cp .env.example .env
# Edit .env if needed (defaults should work)
```

## Running the Pipeline

### Option 1: Command Line

```bash
# Make sure venv is activated
source venv/bin/activate

# Run the job
python -m dagster job execute -f ecommerce_pipeline/jobs/ingest_pipeline.py
```

### Option 2: Dagster UI (Recommended)

```bash
# Start Dagster UI
dagster dev

# Then visit: http://localhost:3000
# Click on "Launches" tab to see job runs
```

## Pipeline Flow

1. **read_json_op** - Read products.json from scraper
2. **transform_op** - Normalize and structure data
3. **postgres_loader_op** - Insert into PostgreSQL (idempotent)
4. **elasticsearch_loader_op** - Index products for search

## Verifying Data

### PostgreSQL

```bash
docker exec -it ecommerce-postgres psql -U ecommerce_user -d ecommerce_db -c "SELECT COUNT(*) FROM products"
```

### Elasticsearch

```bash
curl http://localhost:9200/products/_count
```

## Troubleshooting

### Connection Errors

- Ensure Docker services are running: `docker-compose ps`
- Check hostnames in `.env` match docker-compose service names

### "JSON file not found"

- Run scraper first: `cd ../scraper && npm run scrape`
- Check `SCRAPER_OUTPUT_PATH` in `.env`

## Next Steps

Once pipeline runs successfully, move to Stage 3 (Frontend + API).

read_json_op
    ↓
transform_op
   ↙    ↘
postgres   elasticsearch
_loader    _loader
    ↓         ↓
  Done      Done


1. USER RUNS SCRAPER
   └─ npm run scrape
   └─ Output: packages/scraper/output/products.json

2. USER RUNS DAGSTER PIPELINE
   └─ python -m dagster job execute -f ecommerce_pipeline/jobs/ingest_pipeline.py
   
   a) read_json_op
      └─ Reads: products.json
      └─ Returns: Raw product data
   
   b) transform_op
      └─ Input: Raw data
      └─ Output: Normalized with IDs
   
   c) postgres_loader_op
      └─ Input: Normalized data
      └─ Executes: INSERT statements
      └─ Result: PostgreSQL tables populated
         ├─ categories table
         ├─ subcategories table
         └─ products table
   
   d) elasticsearch_loader_op
      └─ Input: Normalized data
      └─ Executes: Index documents
      └─ Result: Elasticsearch products index

3. DATA NOW READY
   ├─ PostgreSQL: Structured relational data
   ├─ Elasticsearch: Searchable index
   └─ Next: Build API to query both