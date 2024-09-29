const reserveSeatService = require('../services/seatService');
const { logWithTraceId } = require('../utils/logger');

/**
 * Controller to handle seat reservation requests.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const reserveSeat = async (req, res) => {
  const { seatNumber, passengerName, passengerPhone, passengerAge } = req.body;
  const userId = req.user.userId;
  const traceId = req.traceId;
  const logger = logWithTraceId(traceId);
  const spanId = `[SEAT-CONTROLLER][RESERVE-SEAT]`;

  try {
    // Validate input
    if (!seatNumber || !passengerName || !passengerPhone || !passengerAge) {
      logger.warn(`${spanId} Missing required fields for seat reservation.`);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: seatNumber, passengerName, passengerPhone, and passengerAge.',
      });
    }

    if (typeof seatNumber !== 'number' || seatNumber < 1 || seatNumber > 300) {
      logger.warn(`${spanId} Invalid seat number: ${seatNumber}`);
      return res.status(400).json({
        success: false,
        message: `Invalid seat number: ${seatNumber}. Seat number must be between 1 and 300.`,
      });
    }

    logger.info(`${spanId} UserId ${userId} is attempting to reserve seat ${seatNumber}`);

    // Reserve the seat
    const reservedSeat = await reserveSeatService.reserveSeat({
      seatNumber,
      userId,
      passengerName,
      passengerPhone,
      passengerAge,
      traceId,
    });

    logger.info(`${spanId} Seat ${seatNumber} successfully reserved for user ${userId}`);
    res.status(201).json({ success: true, reservation: reservedSeat });
  } catch (error) {
    logger.error(`${spanId} Failed to reserve seat ${seatNumber} for user ${userId}: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Controller to handle seat reset requests.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const resetSeats = async (req, res) => {
  const traceId = req.traceId;
  const logger = logWithTraceId(traceId);
  const spanId = `[SEAT-CONTROLLER][RESET-SEATS]`;

  try {
    // Call the service to reset seat reservations
    const result = await reserveSeatService.resetSeats({ traceId });

    logger.info(`${spanId} Successfully reset seat reservations.`);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`${spanId} Failed to reset seat reservations: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};

module.exports = {
  reserveSeat,
  resetSeats,
};
