const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ userId: user._id , email: user.email}, config.jwtSecret,);
};

// Verify JWT token
const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

module.exports = {
    generateToken,
    verifyToken,
};