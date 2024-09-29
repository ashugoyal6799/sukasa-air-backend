const mongoose = require('mongoose');
const reservationService = require('../../src/services/reservationService');
const reservationRepository = require('../../src/repositories/reservationRepository');
const { logWithTraceId } = require('../../src/utils/logger');

jest.mock('mongoose');
jest.mock('../../src/repositories/reservationRepository');
jest.mock('../../src/utils/logger');

describe('ReservationService', () => {
  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn()
  };

  beforeEach(() => {
    mongoose.startSession.mockResolvedValue(mockSession);
    reservationRepository.reservationExists.mockResolvedValue(false);
    reservationRepository.createReservation.mockResolvedValue({ _id: 'test-reservation-id' });
    logWithTraceId.mockReturnValue({ info: jest.fn(), warn: jest.fn(), error: jest.fn() });
  });

  describe('reserveSeat', () => {
    it('should reserve a seat successfully', async () => {
      const result = await reservationService.reserveSeat({
        seatNumber: 1,
        userId: 'test-user-id',
        passengerName: 'John Doe',
        passengerPhone: '1234567890',
        passengerAge: 30,
        traceId: 'test-trace-id',
        seatId: 'test-seat-id'
      });

      expect(result).toEqual({ _id: 'test-reservation-id' });
      expect(reservationRepository.reservationExists).toHaveBeenCalledWith(1);
      expect(reservationRepository.createReservation).toHaveBeenCalled();
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    it('should handle seat already reserved', async () => {
      reservationRepository.reservationExists.mockResolvedValue(true);

      await expect(reservationService.reserveSeat({
        seatNumber: 1,
        userId: 'test-user-id',
        passengerName: 'John Doe',
        passengerPhone: '1234567890',
        passengerAge: 30,
        traceId: 'test-trace-id',
        seatId: 'test-seat-id'
      })).rejects.toThrow('Seat number 1 is already reserved.');

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it('should handle duplicate key error', async () => {
      // Modify the mockRejectedValue to include the message that the service expects
      reservationRepository.createReservation.mockRejectedValue({
        code: 11000,
        message: 'Seat number 1 is already reserved.',
      });
    
      await expect(
        reservationService.reserveSeat({
          seatNumber: 1,
          userId: 'test-user-id',
          passengerName: 'John Doe',
          passengerPhone: '1234567890',
          passengerAge: 30,
          traceId: 'test-trace-id',
          seatId: 'test-seat-id',
        })
      ).rejects.toThrow('Seat number 1 is already reserved.');
    
      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
    
  });

  describe('resetReservations', () => {
    it('should reset reservations successfully', async () => {
      reservationRepository.resetAllReservations.mockResolvedValue(5);

      const result = await reservationService.resetReservations();

      expect(result).toBe(5);
      expect(reservationRepository.resetAllReservations).toHaveBeenCalled();
    });

    it('should handle reset error', async () => {
      reservationRepository.resetAllReservations.mockRejectedValue(new Error('Reset failed'));

      await expect(reservationService.resetReservations()).rejects.toThrow('Error resetting reservations.');
    });
  });
});