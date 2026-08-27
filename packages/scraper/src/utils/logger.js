const config = require('../config');

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS[config.LOG_LEVEL] || LOG_LEVELS.info;
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${dataStr} ${message}`;
  }

  debug(message, data) {
    if (this.level <= LOG_LEVELS.debug) {
      console.log(this.formatMessage('debug', message, data));
    }
  }

  info(message, data) {
    if (this.level <= LOG_LEVELS.info) {
      console.log(this.formatMessage('info', message, data));
    }
  }

  warn(message, data) {
    if (this.level <= LOG_LEVELS.warn) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message, data) {
    if (this.level <= LOG_LEVELS.error) {
      console.error(this.formatMessage('error', message, data));
    }
  }
}

module.exports = new Logger();