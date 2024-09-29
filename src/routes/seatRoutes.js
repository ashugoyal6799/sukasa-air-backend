const express = require('express');
const router = express.Router();
const SeatController  = require('../controllers/seatController');
const adminMiddleware = require('../middlewares/adminMiddleware');


router.post('/reserve', SeatController.reserveSeat);
router.put('/reset', adminMiddleware, SeatController.resetSeats);

module.exports = router;

