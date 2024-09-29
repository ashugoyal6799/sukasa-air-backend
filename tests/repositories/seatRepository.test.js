const SeatRepository = require('../../src/repositories/seatRepository');
const Seat = require('../../src/models/Seat');

// Mock the Seat model
jest.mock('../../src/models/Seat');

describe('Seat Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSeat', () => {
    it('should create a new seat successfully', async () => {
      const mockSeat = {
        _id: 'seat-id-123',
        seatNumber: 1,
        save: jest.fn().mockResolvedValue({ _id: 'seat-id-123', seatNumber: 1 }),
      };
      Seat.mockImplementation(() => mockSeat);

      const result = await SeatRepository.createSeat(1);

      expect(Seat).toHaveBeenCalledWith({ seatNumber: 1 });
      expect(mockSeat.save).toHaveBeenCalled();
      expect(result).toMatchObject({ _id: 'seat-id-123', seatNumber: 1 });
    });

    it('should throw an error if seat creation fails', async () => {
      const mockError = new Error('Database error');
      Seat.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(mockError),
      }));

      await expect(SeatRepository.createSeat(1)).rejects.toThrow('Error creating seat in the database.');
      
      // Removed logger-related expectations
    });
  });

  describe('getSeatByNumber', () => {
    it('should return a seat by number', async () => {
      const mockSeat = { _id: 'seat-id-123', seatNumber: 1 };
      Seat.findOne = jest.fn().mockResolvedValue(mockSeat);

      const result = await SeatRepository.getSeatByNumber(1);

      expect(Seat.findOne).toHaveBeenCalledWith({ seatNumber: 1 });
      expect(result).toEqual(mockSeat);
    });

    it('should return null if seat is not found', async () => {
      Seat.findOne = jest.fn().mockResolvedValue(null);

      const result = await SeatRepository.getSeatByNumber(1);

      expect(Seat.findOne).toHaveBeenCalledWith({ seatNumber: 1 });
      expect(result).toBeNull();
    });

    it('should throw an error if fetching seat fails', async () => {
      const mockError = new Error('Database error');
      Seat.findOne = jest.fn().mockRejectedValue(mockError);

      await expect(SeatRepository.getSeatByNumber(1)).rejects.toThrow('Error fetching seat from the database.');
      
      // Removed logger-related expectations
    });
  });
});
