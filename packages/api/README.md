# Stage 3: Backend API

Express.js API server for e-commerce platform.

## Features

- Product listing and search
- Full-text search via Elasticsearch
- Filtering (category, price, availability)
- Stripe checkout integration
- Order creation

## Setup

### Installation

```bash
cd packages/api
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env with your Stripe keys
```

## Running

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories` - Get all categories

### Search

- `GET /api/search?q=query` - Search products
- `GET /api/search?q=lemon&category=Bakery&sort=price_asc` - Advanced search

### Checkout

- `POST /api/checkout/session` - Create checkout session
- `GET /api/checkout/success?session_id=...` - Confirm payment

## Example Requests

### Search

```bash
curl "http://localhost:3001/api/search?q=tart&category=Bakery&sort=price_asc"
```

### Checkout

```bash
curl -X POST http://localhost:3001/api/checkout/session \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Lemon Tart", "price": 6.99, "quantity": 1}
    ],
    "email": "customer@example.com"
  }'
```