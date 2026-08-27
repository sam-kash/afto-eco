# AFTO-ECO 

A production-grade mini e-commerce platform demonstrating full-stack engineering with data ingestion, orchestration, search infrastructure, and payment systems integration.

**Built for:** AFTO SDE Technical Assessment  
**Status:** In Progress (Phases 1-3 Complete, Phase 4 In Progress)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Phases](#project-phases)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running Each Stage](#running-each-stage)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Submission Status](#submission-status)

---

## Overview

This project builds a complete e-commerce platform across 4 stages:

1. **Stage 1:** Web scraper to extract product data from target website
2. **Stage 2:** Dagster pipeline to orchestrate data ingestion and transformation
3. **Stage 3:** E-commerce frontend and backend API with search and checkout
4. **Stage 4:** Stripe Connect integration for marketplace payments

### Key Features

- **Data Pipeline:** Automated scraping → transformation → storage
- **Search:** Full-text search with Elasticsearch
- **Database:** Relational data model with PostgreSQL
- **Frontend:** Modern e-commerce UI built with Next.js
- **Payments:** Stripe integration for secure checkout
- **Orchestration:** Dagster for workflow management and idempotency
- **Deployment:** Docker Compose for local development and testing

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Data Ingestion** | Node.js + Puppeteer | Web scraping with pagination handling |
| **Orchestration** | Dagster (Python) | Workflow scheduling and error handling |
| **Database** | PostgreSQL 15 | Relational data storage |
| **Search Engine** | Elasticsearch 8.10 | Full-text search and filtering |
| **Frontend** | Next.js 14 + React | Customer-facing e-commerce UI |
| **Backend API** | Express.js (Node.js) | REST API layer |
| **Payments** | Stripe API | Payment processing |
| **Containerization** | Docker & Docker Compose | Service orchestration |

---

## Project Phases

### Phase 1: Web Scraper (Stage 1)

**Objective:** Extract product data from https://shop.summerhillmarket.com/

**Deliverables:**
- Robust Node.js scraper with Puppeteer
- Handles pagination and lazy loading
- Outputs structured JSON
- Error handling and retry logic

**Time Estimate:** 3-4 hours  
**Status:** Ready to build

### Phase 2: Dagster Pipeline (Stage 2)

**Objective:** Build offline ingestion pipeline with Dagster

**Deliverables:**
- Dagster job that reads JSON from scraper
- Loads data into PostgreSQL
- Syncs to Elasticsearch index
- Implements idempotency and error handling

**Time Estimate:** 4-5 hours  
**Status:** Ready to build

### Phase 3: Frontend & API (Stage 3)

**Objective:** Build customer-facing e-commerce website

**Deliverables:**
- Next.js frontend with product listing, search, and checkout
- Express.js API layer for database and search queries
- Stripe checkout integration
- Search with autocomplete and filtering

**Time Estimate:** 4-5 hours  
**Status:** Ready to build

### Phase 4: Stripe Connect (Stage 4)

**Objective:** Marketplace payment flows with revenue sharing

**Deliverables:**
- Custom connected account creation
- Dynamic revenue split logic
- Fund flow demonstrations
- Account verification handling

**Time Estimate:** 2-3 hours  
**Status:** Documentation first, then implementation

---

## Architecture

### High-Level Data Flow

```
Scraper (Node.js)
    ↓
    └→ products.json
    
products.json
    ↓
Dagster Job
    ├→ PostgreSQL (structured data)
    └→ Elasticsearch (searchable index)
    
Frontend + API
    ├→ Fetch from PostgreSQL
    ├→ Search via Elasticsearch
    └→ Process payments via Stripe
```

### Service Architecture

```
┌─────────────────────────────────────────────┐
│          Frontend (Next.js)                  │
│      http://localhost:3000                   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│       API Server (Express.js)                │
│      http://localhost:3001                   │
└─────────────────────────────────────────────┘
            ↙               ↘
┌──────────────────┐    ┌─────────────────────┐
│   PostgreSQL     │    │   Elasticsearch     │
│ :5432            │    │   :9200             │
└──────────────────┘    └─────────────────────┘
```

---

## Prerequisites

Before starting, ensure you have:

### Required

- **Git** (for version control)
- **Docker Desktop** (https://www.docker.com/products/docker-desktop)
- **Docker Compose** (comes with Docker Desktop)
- **Node.js 18+** (https://nodejs.org/)
- **Python 3.9+** (https://www.python.org/)
- **Stripe Account** (free at https://stripe.com)

### Recommended

- **VS Code** (for editing)
- **Postman** or **Thunder Client** (for API testing)
- **pgAdmin** (PostgreSQL GUI - optional)

### Verification

```bash
# Check Docker
docker --version
docker-compose --version

# Check Node.js
node --version
npm --version

# Check Python
python --version
pip --version
```

---

## Quick Start

### 1. Clone and Setup

```bash
# Enter project directory
cd ecommerce-platform

# Copy environment file
cp .env.example .env

# Edit .env with your Stripe keys (optional for now)
# Get keys from: https://dashboard.stripe.com/test/apikeys
```

### 2. Start All Services

```bash
# Start PostgreSQL and Elasticsearch
docker-compose up

# In another terminal window, verify services are running
curl http://localhost:9200/_cluster/health  # Should return cluster health
psql -h localhost -U ecommerce_user -d ecommerce_db -c "SELECT 1"
```

**Expected output:** Services running and healthy

### 3. Verify Database Schema

```bash
# Connect to PostgreSQL and check tables
docker exec -it ecommerce-postgres psql -U ecommerce_user -d ecommerce_db -c "\dt"

# You should see:
# - categories
# - subcategories
# - products
# - orders
# - order_items
```

---

## Project Structure

```
ecommerce-platform/
│
├── README.md                          # This file
├── docker-compose.yml                 # Docker services configuration
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
│
├── packages/                          # All application code
│   │
│   ├── scraper/                       # Stage 1: Web Scraper
│   │   ├── README.md                  # Scraper-specific docs
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── scraper.js            # Main scraping logic
│   │   │   ├── parser.js             # Data parsing
│   │   │   ├── config.js             # Configuration
│   │   │   └── utils/
│   │   │       ├── logger.js
│   │   │       ├── retry.js
│   │   │       └── validator.js
│   │   └── output/
│   │       └── products.json         # Generated output
│   │
│   ├── dagster/                       # Stage 2: Orchestration
│   │   ├── README.md                  # Dagster-specific docs
│   │   ├── requirements.txt
│   │   ├── setup.py
│   │   ├── dagster.yaml
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── ecommerce_pipeline/
│   │   │   ├── __init__.py
│   │   │   ├── jobs/
│   │   │   │   └── ingest_pipeline.py
│   │   │   ├── ops/
│   │   │   │   ├── read_json_op.py
│   │   │   │   ├── transform_op.py
│   │   │   │   ├── postgres_loader_op.py
│   │   │   └── elasticsearch_loader_op.py
│   │   ├── resources/
│   │   │   ├── postgres_resource.py
│   │   │   └── elasticsearch_resource.py
│   │   └── queries/
│   │       └── sample_queries.md
│   │
│   ├── api/                           # Stage 3: Backend API
│   │   ├── README.md                  # API-specific docs
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── server.js             # Express app entry
│   │   │   ├── routes/
│   │   │   │   ├── products.js
│   │   │   │   ├── search.js
│   │   │   │   ├── cart.js
│   │   │   │   └── checkout.js
│   │   │   ├── controllers/
│   │   │   │   ├── productController.js
│   │   │   │   ├── searchController.js
│   │   │   │   └── checkoutController.js
│   │   │   ├── services/
│   │   │   │   ├── db.js
│   │   │   │   ├── elasticsearch.js
│   │   │   │   └── stripe.js
│   │   │   └── middleware/
│   │   │       ├── errorHandler.js
│   │   │       └── requestValidator.js
│   │   └── config/
│   │       ├── database.js
│   │       └── stripe.js
│   │
│   └── frontend/                      # Stage 3: Frontend
│       ├── README.md                  # Frontend-specific docs
│       ├── package.json
│       ├── .env.example
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── Dockerfile
│       └── src/
│           ├── pages/
│           │   ├── index.js           # Home page
│           │   ├── products/
│           │   │   └── [id].js        # Product detail
│           │   ├── search.js          # Search results
│           │   ├── cart.js            # Cart page
│           │   └── checkout.js        # Checkout page
│           ├── components/
│           │   ├── Layout.js
│           │   ├── ProductCard.js
│           │   ├── SearchBar.js
│           │   ├── Cart/
│           │   └── Checkout/
│           ├── hooks/
│           │   ├── useSearch.js
│           │   └── useCart.js
│           ├── services/
│           │   └── api.js
│           └── styles/
│               └── globals.css
│
├── sql/                               # Database schemas
│   └── schema.sql                     # Complete database schema
│
├── docs/                              # Documentation
│   ├── SETUP.md                       # Detailed setup guide
│   ├── ARCHITECTURE.md                # System design document
│   ├── API_ENDPOINTS.md               # API reference
│   ├── DATABASE_SCHEMA.md             # Database design
│   ├── ELASTICSEARCH_DESIGN.md        # Search strategy
│   ├── STRIPE_FLOW.md                 # Payment flows
│   └── DEPLOYMENT.md                  # Deployment guide
│
└── .docker/                           # Docker entry scripts
    └── entrypoint.sh
```

---

## Setup Instructions

### Step 1: Initialize Project

```bash
# Clone or create project
git clone <your-repo-url> ecommerce-platform
cd ecommerce-platform

# Initialize if not cloned
git init
```

### Step 2: Environment Configuration

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
# For now, defaults should work. Get Stripe keys from:
# https://dashboard.stripe.com/test/apikeys
```

### Step 3: Start Core Services

```bash
# Start PostgreSQL and Elasticsearch
docker-compose up -d

# Verify they're running
docker-compose ps

# Expected output:
# NAME                      COMMAND                  SERVICE                  STATUS
# ecommerce-elasticsearch   /bin/tini -- /usr/local/bin/docker-entrypoint.sh   elasticsearch     Up
# ecommerce-postgres        docker-entrypoint.sh postgres                     postgres          Up
```

### Step 4: Verify Database

```bash
# Check PostgreSQL
docker exec -it ecommerce-postgres psql -U ecommerce_user -d ecommerce_db -c "\dt"

# You should see all tables created:
# - categories
# - subcategories
# - products
# - orders
# - order_items
```

### Step 5: Verify Elasticsearch

```bash
# Check Elasticsearch is healthy
curl http://localhost:9200/_cluster/health

# Expected response:
# {"cluster_name":"docker-cluster","status":"green",...}
```

---

## Running Each Stage

### Stage 1: Scraper

```bash
cd packages/scraper

# Install dependencies
npm install

# Create .env from .env.example
cp .env.example .env

# Run scraper
npm run scrape

# Output: packages/scraper/output/products.json
```

**See:** `packages/scraper/README.md` for detailed instructions

### Stage 2: Dagster

```bash
cd packages/dagster

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Dagster UI (optional)
dagster dev

# Run the pipeline
python -m dagster job execute -f ecommerce_pipeline/jobs/ingest_pipeline.py
```

**See:** `packages/dagster/README.md` for detailed instructions

### Stage 3: API

```bash
cd packages/api

# Install dependencies
npm install

# Create .env from .env.example
cp .env.example .env

# Start API server
npm run dev

# API will be available at http://localhost:3001
```

**See:** `packages/api/README.md` for API endpoints

### Stage 3: Frontend

```bash
cd packages/frontend

# Install dependencies
npm install

# Create .env from .env.example
cp .env.example .env

# Start Next.js development server
npm run dev

# Frontend will be available at http://localhost:3000
```

**See:** `packages/frontend/README.md` for feature details

### Stage 4: Stripe Connect

```bash
# See docs/STRIPE_FLOW.md for implementation guide
# Currently in documentation phase
# Implementation in progress
```

---

## Documentation

### Core Documentation

| Document | Purpose |
|----------|---------|
| [SETUP.md](docs/SETUP.md) | Step-by-step setup guide |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design and decisions |
| [API_ENDPOINTS.md](docs/API_ENDPOINTS.md) | Complete API reference |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Database design and relationships |
| [ELASTICSEARCH_DESIGN.md](docs/ELASTICSEARCH_DESIGN.md) | Search index strategy |
| [STRIPE_FLOW.md](docs/STRIPE_FLOW.md) | Payment processing flows |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide |

---

## Deployment

### Docker Compose (Development)

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api
docker-compose logs -f dagster
```

### Production Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production setup with Kubernetes or cloud providers.

---

## Key Technologies

### Why These Choices?

- **Dagster:** Industry-standard orchestration with built-in error handling and idempotency
- **PostgreSQL:** Relational model perfect for structured commerce data
- **Elasticsearch:** Best-in-class full-text search and faceted filtering
- **Next.js:** Server-side rendering and optimized frontend performance
- **Stripe:** PCI-compliant payment processing with extensive APIs
- **Docker:** Reproducible development and deployment environment

---

## API Endpoints (Quick Reference)

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/category/:categoryId` - Filter by category

### Search

- `GET /api/search?q=query` - Search products
- `GET /api/search?q=query&category=cat1&sort=price` - Advanced search

### Cart

- `POST /api/cart/add` - Add to cart
- `GET /api/cart` - Get cart contents
- `DELETE /api/cart/:itemId` - Remove from cart

### Checkout

- `POST /api/checkout` - Create checkout session (Stripe)
- `GET /api/order/:orderId` - Get order details

---

## Submission Status

| Phase | Component | Status | Notes |
|-------|-----------|--------|-------|
| 1 | Scraper | ⏳ In Progress | Building |
| 2 | Dagster Pipeline | ⏳ In Progress | Building |
| 3 | Frontend | ⏳ In Progress | Building |
| 3 | API | ⏳ In Progress | Building |
| 4 | Stripe Connect | 📝 Documented | Implementation pending |

**Expected Completion:** End of day tomorrow

---

## Troubleshooting

### PostgreSQL Connection Refused

```bash
# Ensure Docker container is running
docker-compose ps

# If not running, start it
docker-compose up postgres
```

### Elasticsearch Not Responding

```bash
# Check if container is healthy
docker-compose ps

# View logs
docker-compose logs elasticsearch
```

### Port Already in Use

```bash
# If port 3000, 3001, 5432, or 9200 is already in use:
# Either kill the process using that port OR
# Update docker-compose.yml to use different ports
```

### Database Schema Not Found

```bash
# Schema loads on first docker-compose up
# To reload schema:
docker-compose down -v  # -v removes volumes
docker-compose up       # Restart with fresh database
```

---

## Performance Considerations

- **Pagination:** Implement cursor-based pagination for large datasets
- **Caching:** Add Redis layer for frequently accessed products
- **Search:** Elasticsearch aggregations for faceted navigation
- **Database:** Proper indexing on frequently queried columns
- **API:** Rate limiting and request validation middleware

---

## Testing

```bash
# API Testing (with Postman/Thunder Client)
# See docs/API_ENDPOINTS.md for test cases

# Unit Tests (to be added)
npm run test

# Integration Tests
npm run test:integration
```

---

## Contributing

This is a personal project for technical assessment. Standard git workflow:

```bash
git add .
git commit -m "feat: add scraper functionality"
git push origin main
```

---

## License

Private project for technical assessment purposes.

---

## Support

For issues or questions:

1. Check documentation in `/docs`
2. Review troubleshooting section above
3. Check GitHub issues (if applicable)

---

## Author

Built as AFTO SDE Technical Assessment Submission

**Timeline:** 24-30 hours sprint  
**Deadline:** End of day [DATE]

---

**Last Updated:** [DATE]  
**Status:** Active Development