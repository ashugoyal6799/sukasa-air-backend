const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 300,
  },
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  passengerName: {
    type: String,
    required: true,
  },
  passengerPhone: {
    type: String,
    required: true,
  },
  passengerAge: {
    type: Number,
    required: true,
  },
  reservedAt: {
    type: Date,
    default: Date.now,
  },
});

reservationSchema.index({ seatNumber: 1 }, { unique: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
