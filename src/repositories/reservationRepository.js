const Reservation = require('../models/Reservation');

class ReservationRepository {
  
  // Create a new reservation in the database
  async createReservation(reservationData, session) {
    try {
      const reservation = new Reservation(reservationData);
      
      await reservation.save({ session });
      return reservation;
    } catch (error) {
      throw new Error('Error creating reservation.');
    }
  }

  // Check if a reservation exists for a specific seat number
  async reservationExists(seatNumber) {
    try {
      const exists = await Reservation.exists({ seatNumber });
      return exists;
    } catch (error) {
      throw new Error('Error checking reservation existence.');
    }
  }

  // Reset all reservations by archiving them and then deleting
  async resetAllReservations() {
    try {
      // Move reservations to ArchivedReservations collection
      await Reservation.aggregate([
        { $match: {} },
        { $out: 'ArchivedReservations' },
      ]);

      // Delete all reservations from the main collection
      const result = await Reservation.deleteMany({});
      return result.deletedCount;
    } catch (error) {
      throw new Error('Error resetting reservations.');
    }
  }
}

module.exports = new ReservationRepository();
