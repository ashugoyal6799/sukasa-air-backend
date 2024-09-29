const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Define a simple log format
const simpleFormat = printf(({ level, message, timestamp, traceId = '' }) => {
  // Properly format the log message
  const traceInfo = traceId ? `[TraceId: ${traceId}]` : '';
  return `${timestamp} [${level.toUpperCase()}] ${traceInfo} : ${message}`;
});

// Create a unified logger instance with basic configuration
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp in a readable format
    simpleFormat // Use the simplified log format
  ),
  transports: [
    new transports.Console(), // Log to console
    // new transports.File({ filename: 'logs/app.log' }), // Log to a single file
  ],
});

// Function to create a logger with an optional trace ID
const logWithTraceId = (traceId) => ({
  info: (message) => logger.info(message, { traceId }),
  warn: (message) => logger.warn(message, { traceId }),
  error: (message) => logger.error(message, { traceId }),
  debug: (message) => logger.debug(message, { traceId }),
});

module.exports = { logger,  logWithTraceId };
