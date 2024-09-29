const mongoose = require('mongoose');
const reservationRepository = require('../repositories/reservationRepository');
const { logWithTraceId } = require('../utils/logger');

/**
 * Service to handle reservation logic.
 * @param {Object} params - Parameters for reservation.
 * @param {number} params.seatNumber - The seat number to reserve.
 * @param {string} params.userId - The user ID making the reservation.
 * @param {string} params.passengerName - The name of the passenger.
 * @param {string} params.passengerPhone - The phone number of the passenger.
 * @param {number} params.passengerAge - The age of the passenger.
 * @param {string} params.traceId - The trace ID for logging.
 * @param {string} params.seatId - The ID of the seat document.
 * @returns {Object} - The reservation information.
 * @throws {Error} - Throws an error if reservation fails.
 */
const reserveSeat = async ({ seatNumber, userId, passengerName, passengerPhone, passengerAge, traceId, seatId }) => {
  const logger = logWithTraceId(traceId);
  const spanId = `[RESERVATION-SERVICE][RESERVE-SEAT]`;

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the seat is already reserved
    const existingReservation = await reservationRepository.reservationExists(seatNumber);

    if (existingReservation) {
      logger.warn(`${spanId} Seat ${seatNumber} is already reserved.`);
      throw new Error(`Seat number ${seatNumber} is already reserved.`); // Propagate error with clear message
    }

    // Create the reservation
    const reservationData = {
      seatNumber,
      seatId,
      user: userId,
      passengerName,
      passengerPhone,
      passengerAge,
    };

    const reservation = await reservationRepository.createReservation(reservationData, session);

    // Commit the transaction
    await session.commitTransaction();
    logger.info(`${spanId} Seat ${seatNumber} successfully reserved for user ${userId}.`);
    return reservation;
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();

    logger.error(`${spanId} Failed to reserve seat ${seatNumber} for user ${userId}: ${error.message}`);
    throw new Error(error.message);
  } finally {
    // End the session
    session.endSession();
  }
};

/**
 * Service to reset all reservations -  restricted to Admin only
 * @returns {number} - The number of reservations reset.
 * @throws {Error} - Throws an error if reset fails.
 */
const resetReservations = async () => {
  try {
    const resetCount = await reservationRepository.resetAllReservations();
    return resetCount;
  } catch (error) {
    throw new Error('Error resetting reservations.');
  }
};

module.exports = {
  reserveSeat,
  resetReservations,
};
