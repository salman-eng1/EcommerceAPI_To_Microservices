const UsersRepository = require("../repositories/userRepository");
const User = require("../models/userModel");

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async createUser(user) {
    try {
      const createdUser = await this.usersRepository.create(user);
      return createdUser;
    } catch (err) {
      console.log("DB Error >> Cannot create User", err);
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.usersRepository.findById(userId);
      return user;
    } catch (err) {
      console.log("DB Error >> Cannot get User", err);
    }
  }

  async getUsers() {
    try {
      const users = await this.usersRepository.findAll();
      return users;
    } catch (err) {
      console.log("DB Error >> Cannot get Users", err);
    }
  }

  async deleteUser(userId) {
    try {
      const user = await this.usersRepository.findByIdAndDelete(userId);

      return user;
    } catch (err) {
      console.log("DB Error >> Cannot delete User", err);
    }
  }

  async updateUser(userId, newData) {
    try {
      const user = await this.usersRepository.findByIdAndUpdate(userId, 
        newData, // Use $set to update specific fields
      );
      return user;
    } catch (err) {
      console.log("DB Error >> Cannot Update User", err);
    }
  }

  async getUserByEmail(email) {
    try {
      const existingUser = await User.findOne({ email: email });
      return existingUser; // Return true if email is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log("Database error while getting user by email", err);
    }
  }
}

module.exports = UsersService;
