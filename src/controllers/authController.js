const authService = require('../services/authService');
const { logWithTraceId } = require('../utils/logger');
const validator = require('validator');  // Import the validator module

/**
 * Controller to handle user login requests.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const login = async (req, res) => {
  const { emailId } = req.body;
  const traceId = req.traceId;
  const logger = logWithTraceId(traceId);
  const spanId = `[AUTH-CONTROLLER][LOGIN]`;

  try {
    // Input validation
    if (!emailId) {
      logger.warn(`${spanId} Missing 'emailId' in request body.`);
      return res.status(400).json({
        success: false,
        message: 'Missing required field: emailId.',
      });
    }

    // Validate email format
    if (!validator.isEmail(emailId)) {
      logger.warn(`${spanId} Invalid email format: ${emailId}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    logger.info(`${spanId} Attempting to log in user with email: ${emailId}`);

    // Call the authentication service to perform login
    const token = await authService.login(emailId, traceId);

    logger.info(`${spanId} Login successful for email: ${emailId}`);
    res.status(200).json({ success: true, token });
  } catch (error) {
    logger.error(`${spanId} Login failed for email: ${emailId}, Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
};
