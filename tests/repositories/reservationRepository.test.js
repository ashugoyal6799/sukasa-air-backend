const ReservationRepository = require('../../src/repositories/reservationRepository');
const Reservation = require('../../src/models/Reservation');

jest.mock('../../src/models/Reservation');

describe('Reservation Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReservation', () => {
    it('should create a new reservation', async () => {
      const mockReservationData = {
        seatNumber: 1,
        userId: 'user-id',
        passengerName: 'John Doe',
      };
      const mockSession = {};
      const mockSavedReservation = { ...mockReservationData, _id: 'reservation-id' };
  
      // Mock implementation of the save method to assign _id
      const mockSave = jest.fn().mockImplementation(function (options) {
        this._id = mockSavedReservation._id;
        return Promise.resolve(this);
      });
  
      // Mock the Reservation constructor to return an object with the reservation data and the mocked save method
      Reservation.mockImplementation(function (data) {
        return { ...data, save: mockSave };
      });
  
      const result = await ReservationRepository.createReservation(mockReservationData, mockSession);
  
      // Extract relevant properties to ignore unwanted methods like `save`
      const { _id, seatNumber, userId, passengerName } = result;
  
      // Compare only the extracted properties with the expected result
      expect({ _id, seatNumber, userId, passengerName }).toEqual(mockSavedReservation);
  
      expect(Reservation).toHaveBeenCalledWith(mockReservationData);
      expect(mockSave).toHaveBeenCalledWith({ session: mockSession });
    });
  
    it('should handle errors when creating a reservation', async () => {
      const mockReservationData = {
        seatNumber: 1,
        userId: 'user-id',
        passengerName: 'John Doe',
      };
      const mockSession = {};
  
      // Mock the Reservation constructor to return an object with a save method that rejects
      Reservation.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      }));
  
      await expect(
        ReservationRepository.createReservation(mockReservationData, mockSession)
      ).rejects.toThrow('Error creating reservation.');
    });
  });

  describe('reservationExists', () => {
    it('should check if a reservation exists', async () => {
      Reservation.exists.mockResolvedValue(true);

      const result = await ReservationRepository.reservationExists(1);

      expect(result).toBe(true);
      expect(Reservation.exists).toHaveBeenCalledWith({ seatNumber: 1 });
    });

    it('should handle errors when checking reservation existence', async () => {
      Reservation.exists.mockRejectedValue(new Error('Database error'));

      await expect(
        ReservationRepository.reservationExists(1)
      ).rejects.toThrow('Error checking reservation existence');
    });
  });

  describe('resetAllReservations', () => {
    it('should reset all reservations', async () => {
      const mockAggregate = jest.fn().mockReturnThis();
      const mockExec = jest.fn().mockResolvedValue([{ count: 10 }]);
      Reservation.aggregate = mockAggregate;
      Reservation.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 10 });

      mockAggregate.mockReturnValue({
        exec: mockExec,
      });

      const result = await ReservationRepository.resetAllReservations();

      expect(result).toBe(10);
      expect(mockAggregate).toHaveBeenCalledWith([{ $match: {} }, { $out: 'ArchivedReservations' }]);
      expect(Reservation.deleteMany).toHaveBeenCalledWith({});
    });

    it('should handle errors when resetting reservations', async () => {
      Reservation.aggregate = jest.fn().mockRejectedValue(new Error('Aggregation error'));
      Reservation.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

      await expect(ReservationRepository.resetAllReservations()).rejects.toThrow(
        'Error resetting reservations'
      );
    });
  });
});
