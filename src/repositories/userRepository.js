const User = require('../models/User');

class UserRepository {
  
  // Find a user by email
  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Create a new user with the provided email
  async createUser(email) {
    try {
      const newUser = await User.create({ email });
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Create a new user only if it doesn't exist in the database
  async createUserIfNotExists(email) {
    try {
      const user = await this.findByEmail(email);
      if (user) return user;
      return await this.createUser(email);
    } catch (error) {
      throw new Error(`Error creating user if not exists: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();
