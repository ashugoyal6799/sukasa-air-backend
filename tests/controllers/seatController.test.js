const { reserveSeat, resetSeats } = require('../../src/controllers/seatController');
const SeatService = require('../../src/services/seatService');

jest.mock('../../src/services/seatService'); // Mock the SeatService

describe('Seat Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        seatNumber: 1,
        passengerName: 'John Doe',
        passengerPhone: '1234567890',
        passengerAge: 30,
      },
      user: { userId: 'user-id-123' },
      traceId: 'trace-id-123',
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  describe('reserveSeat', () => {
    it('should reserve a seat successfully', async () => {
      const mockReservation = { seatNumber: 1, passengerName: 'John Doe' };
      SeatService.reserveSeat.mockResolvedValue(mockReservation); // Mock successful reservation

      await reserveSeat(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, reservation: mockReservation });
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { seatNumber: 1 }; // Missing required fields

      await reserveSeat(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Missing required fields: seatNumber, passengerName, passengerPhone, and passengerAge.',
      });
    });
  });

  describe('resetSeats', () => {
    beforeEach(() => {
      req = { traceId: 'trace-id-123' }; // Reset request mock
    });

    it('should reset seats successfully', async () => {
      const mockResult = { success: true, message: 'Successfully reset 2 reservations.' };
      SeatService.resetSeats.mockResolvedValue(mockResult); // Mock successful reset response

      await resetSeats(req, res);

      expect(SeatService.resetSeats).toHaveBeenCalledWith({ traceId: 'trace-id-123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors during seat reset', async () => {
      SeatService.resetSeats.mockRejectedValue(new Error('Reset Failed'));

      await resetSeats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error.',
      });
    });
  });
});
