const logger = require('./logger');
const config = require('../config');

async function retryWithExponentialBackoff(
  fn,
  maxRetries = config.RETRY_ATTEMPTS,
  initialDelay = config.RETRY_DELAY
) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, {
          error: error.message,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        logger.error(`All ${maxRetries} attempts failed`, {
          error: error.message,
        });
      }
    }
  }

  throw lastError;
}

module.exports = {
  retryWithExponentialBackoff,
};