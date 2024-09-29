const { verifyToken } = require('../utils/tokenUtil');
const { logWithTraceId } = require('../utils/logger');

/**
 * Middleware to authenticate and authorize users using JWT tokens.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authMiddleware = (req, res, next) => {
  const traceId = req.traceId;
  const logger = logWithTraceId(traceId);
  const spanId = `[AUTH-MIDDLEWARE]`;

  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      logger.warn(`${spanId} No Authorization header provided.`);
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      logger.warn(`${spanId} Token not found in Authorization header.`);
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify the token
    req.user = verifyToken(token);
    logger.info(`${spanId} User ${req.user.email} authenticated successfully.`);
    next();
  } catch (error) {
    logger.error(`${spanId} Authentication failed: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
