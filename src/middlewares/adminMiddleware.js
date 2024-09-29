const config = require('../config');
const { logWithTraceId } = require('../utils/logger');

/**
 * Middleware to authorize admin users based on their email.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const adminMiddleware = (req, res, next) => {
  const traceId = req.traceId;
  const logger = logWithTraceId(traceId);
  const spanId = `[ADMIN-MIDDLEWARE]`;

  const user = req.user;

  if (!user || !user.email) {
    logger.warn(`${spanId} No user information found in request.`);
    return res.status(401).json({ success: false, message: 'Unauthorized: No user information found.' });
  }

  if (config.adminEmails.includes(user.email)) {
    logger.info(`${spanId} Admin ${user.email} authorized.`);
    next();
  } else {
    logger.warn(`${spanId} Access denied for user ${user.email}. Admins only.`);
    return res.status(403).json({ success: false, message: 'Access denied: Admins only.' });
  }
};

module.exports = adminMiddleware;
