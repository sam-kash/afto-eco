const logger = require('./logger');

function validateProduct(product) {
  const errors = [];

  if (!product.name || typeof product.name !== 'string') {
    errors.push('Product name is required and must be a string');
  }

  if (product.price === undefined || isNaN(parseFloat(product.price))) {
    errors.push('Product price is required and must be a number');
  }

  if (!product.category || typeof product.category !== 'string') {
    errors.push('Product category is required');
  }

  if (!Array.isArray(product.images)) {
    errors.push('Product images must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateProductData(data) {
  const errors = [];

  if (!Array.isArray(data)) {
    errors.push('Data must be an array');
    return { isValid: false, errors };
  }

  if (data.length === 0) {
    logger.warn('No products found in data');
  }

  data.forEach((product, index) => {
    const validation = validateProduct(product);
    if (!validation.isValid) {
      errors.push(`Product ${index}: ${validation.errors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateProduct,
  validateProductData,
};