const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 300,
  },
});

const Seat = mongoose.model('Seat', seatSchema);
module.exports = Seat;