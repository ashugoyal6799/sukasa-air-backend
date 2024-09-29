const userRepository = require('../repositories/userRepository');
const { logWithTraceId } = require('../utils/logger');
const { generateToken } = require('../utils/tokenUtil');

/**
 * Service to handle user login logic.
 * @param {string} email - User's email address.
 * @param {string} traceId - Trace ID for logging.
 * @returns {string} - JWT token for authenticated user.
 * @throws {Error} - Throws an error if login fails.
 */
const login = async (email, traceId) => {
  const logger = logWithTraceId(traceId);
  const spanId = `[AUTH-SERVICE][LOGIN]`;

  try {
    logger.info(`${spanId} Attempting to log in user with email: ${email}`);

    // Check if user exists or create a new one
    const user = await userRepository.createUserIfNotExists(email);

    logger.info(`${spanId} User ${user._id} logged in successfully.`);

    // Generate JWT token for the user
    const token = generateToken(user);
    return token;
  } catch (error) {
    logger.error(`${spanId} Error logging in user with email ${email}: ${error.message}`);
    // Propagate the original error message for better context
    throw new Error(error.message);
  }
};

module.exports = {
  login,
};
