const pino = require('pino');

const {LOG_LEVEL, LOG_SERVICE_NAME} = require('./config/logger-config');

const logger = pino({
  name: LOG_SERVICE_NAME,
  level: LOG_LEVEL,
  // Given privacy concerns, there are likely many fields we want to redact by default
  redact: ['email'],
});

module.exports = {logger};
