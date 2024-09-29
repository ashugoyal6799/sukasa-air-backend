const seatRepository = require('../repositories/seatRepository');
const reservationService = require('./reservationService');
const { logWithTraceId } = require('../utils/logger');

/**
 * Service to handle seat reservation logic.
 * @param {Object} params - Parameters for seat reservation.
 * @param {number} params.seatNumber - The seat number to reserve.
 * @param {string} params.userId - The user ID making the reservation.
 * @param {string} params.passengerName - The name of the passenger.
 * @param {string} params.passengerPhone - The phone number of the passenger.
 * @param {number} params.passengerAge - The age of the passenger.
 * @param {string} params.traceId - The trace ID for logging.
 * @returns {Object} - The reserved seat information.
 * @throws {Error} - Throws an error if reservation fails.
 */
const reserveSeat = async ({ seatNumber, userId, passengerName, passengerPhone, passengerAge, traceId }) => {
  const logger = logWithTraceId(traceId);
  const spanId = `[SEAT-SERVICE][RESERVE-SEAT]`;

  try {
    logger.info(`${spanId} Attempting to reserve seat ${seatNumber} for user ${userId}`);

    // Validate seat number
    if (seatNumber < 1 || seatNumber > 300) {
      logger.warn(`${spanId} Invalid seat number: ${seatNumber}`);
      throw new Error(`Invalid seat number: ${seatNumber}. Seat number must be between 1 and 300.`);
    }

    // Check if seat exists
    let seat = await seatRepository.getSeatByNumber(seatNumber);
    if (!seat) {
      logger.warn(`${spanId} Seat ${seatNumber} does not exist. Creating new seat.`);
      seat = await seatRepository.createSeat(seatNumber);
    }

    // Call Reservation Service to reserve the seat
    const reservation = await reservationService.reserveSeat({
      seatNumber,
      userId,
      passengerName,
      passengerPhone,
      passengerAge,
      traceId,
      seatId: seat._id.toString(),
    });
    return reservation;
  } catch (error) {
    logger.error(`${spanId} Failed to reserve seat ${seatNumber} for user ${userId}: ${error.message}`);
    // Propagate the original error message for better context
    throw new Error(error.message);
  }
};

/**
 * Service to reset all seat reservations.
 * @param {Object} params - Parameters for resetting seats.
 * @param {string} params.traceId - The trace ID for logging.
 * @returns {Object} - Success message and count of reset reservations.
 * @throws {Error} - Throws an error if reset fails.
 */
const resetSeats = async ({ traceId }) => {
  const logger = logWithTraceId(traceId);
  const spanId = `[SEAT-SERVICE][RESET-SEATS]`;

  try {
    const resetCount = await reservationService.resetReservations();
    logger.info(`${spanId} Successfully reset ${resetCount} reservations.`);
    return { success: true, message: `Successfully reset ${resetCount} reservations.` };
  } catch (error) {
    logger.error(`${spanId} Failed to reset reservations: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  reserveSeat,
  resetSeats,
};
