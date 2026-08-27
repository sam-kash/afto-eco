const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'ecommerce_user',
  password: process.env.POSTGRES_PASSWORD || 'ecommerce_password',
  database: process.env.POSTGRES_DB || 'ecommerce_db',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;