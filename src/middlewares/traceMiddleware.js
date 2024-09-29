const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to assign a unique trace ID to each incoming request.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const traceMiddleware = (req, res, next) => {
  const traceId = uuidv4(); // Generate a unique trace ID
  req.traceId = traceId;    // Attach the trace ID to the request object
  res.setHeader('X-Trace-Id', traceId); // Include the trace ID in the response header
  next();
};

module.exports = traceMiddleware;
