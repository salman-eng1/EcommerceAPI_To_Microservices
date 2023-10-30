const User = require("../models/userModel");

class UsersRepository {
  constructor(){
    this.user=User
  }
  async create(user) {
    const createdUser = await this.user.create(user);
    return createdUser;
  }

  async findByIdAndUpdate(userId, newData) {
    const user = await this.user.findByIdAndUpdate(userId, newData, {
      new: true,
    });
    console.log(newData)
    return user;
  }

  async findById(userId) {
    const user = await this.user.findById(userId);
    return user;
  }

  async findByIdAndDelete(userId) {
    const user = await this.user.findByIdAndDelete(userId);
    return user;
  }

  async findAll() {
    const users = await this.user.find();
    return users;
  }
}
module.exports = UsersRepository;
