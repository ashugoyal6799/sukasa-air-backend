const Seat = require('../models/Seat');

class SeatRepository {
  
  // Check if a seat exists by seat number
  async seatExists(seatNumber) {
    try {
      const exists = await Seat.exists({ seatNumber });
      return exists;
    } catch (error) {
      throw new Error('Error checking seat existence.');
    }
  }

  // Create a new seat with a specific seat number
  async createSeat(seatNumber) {
    try {
      const newSeat = new Seat({ seatNumber });
      await newSeat.save();
      return newSeat;
    } catch (error) {
      throw new Error('Error creating seat in the database.');
    }
  }

  // Get details of a seat by seat number
  async getSeatByNumber(seatNumber) {
    try {
      const seat = await Seat.findOne({ seatNumber });
      return seat;
    } catch (error) {
      throw new Error('Error fetching seat from the database.');
    }
  }
}

module.exports = new SeatRepository();
