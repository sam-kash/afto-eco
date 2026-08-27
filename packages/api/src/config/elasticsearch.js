const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: `${process.env.ELASTICSEARCH_SCHEME || 'http'}://${process.env.ELASTICSEARCH_HOST || 'localhost'}:${process.env.ELASTICSEARCH_PORT || 9200}`,
});

// Test connection
client.info()
  .then(() => console.log(' Connected to Elasticsearch'))
  .catch(err => console.error(' Elasticsearch connection failed:', err));

module.exports = client;