const seatService = require('../../src/services/seatService');
const seatRepository = require('../../src/repositories/seatRepository');
const reservationService = require('../../src/services/reservationService');

jest.mock('../../src/repositories/seatRepository');
jest.mock('../../src/services/reservationService');

describe('Seat Service', () => {
  it('should reserve a seat successfully', async () => {
    seatRepository.getSeatByNumber.mockResolvedValue(null);
    seatRepository.createSeat.mockResolvedValue({ _id: 'seat-id-123', seatNumber: 1 });
    reservationService.reserveSeat.mockResolvedValue({ seatNumber: 1, passengerName: 'John Doe' });

    const result = await seatService.reserveSeat({
      seatNumber: 1,
      userId: 'user-id-123',
      passengerName: 'John Doe',
      passengerPhone: '1234567890',
      passengerAge: 30,
      traceId: 'trace-id-123',
    });

    expect(result).toEqual({ seatNumber: 1, passengerName: 'John Doe' });
  });

  it('should throw an error if seat number is invalid', async () => {
    await expect(seatService.reserveSeat({ seatNumber: 0 })).rejects.toThrow(
      'Invalid seat number: 0. Seat number must be between 1 and 300.'
    );
  });

  it('should reset all seats', async () => {
    reservationService.resetReservations.mockResolvedValue(10);

    const result = await seatService.resetSeats({ traceId: 'trace-id-123' });

    expect(result).toEqual({ success: true, message: `Successfully reset 10 reservations.` });
  });
});
