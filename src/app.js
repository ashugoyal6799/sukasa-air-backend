const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const seatRoutes = require('./routes/seatRoutes');

const config = require('./config');
const traceMiddleware = require('./middlewares/traceMiddleware'); // Import the trace ID middleware
const authMiddleware = require('./middlewares/authMiddleware'); // Import the auth middleware 
const { logger } = require('./utils/logger'); // Import the logger

const app = express();

// Middleware for Trace ID
app.use(traceMiddleware);

app.use(express.json());

// Database Connection
mongoose.connect(config.mongoURI, { })
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

// API Routes
app.use('/login', authRoutes);
app.use('/seat',authMiddleware,seatRoutes);
// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});


module.exports = app;
