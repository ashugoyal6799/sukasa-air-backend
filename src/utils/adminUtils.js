const config = require('../config');

// Utility function to check if an email is an admin email
const isAdminEmail = (email) => {
  return config.adminEmails.includes(email);
};

module.exports = {
  isAdminEmail,
};
