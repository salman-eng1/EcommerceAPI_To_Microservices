const CartRepository = require("../repositories/cartRepository");
const Cart = require("../models/cartModel");

class CartService {
  constructor() {
    this.cartRepository = new CartRepository(Cart);
  }

  async createCart(cart) {
    try {
      const createdCart = await this.cartRepository.create(cart);
      return createdCart;
    } catch (err) {
      console.log("DB Error >> Cannot Create Cart", err);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await this.cartRepository.findById(cartId);
      return cart;
    } catch (err) {
      console.log("DB Error >> Cannot get Cart", err);
    }
  }

  async getAllCarts() {
    try {
      const carts = await this.cartRepository.findAll();
      if (carts) {
        return carts;
      }
    } catch (err) {
      console.log("DB Error >> Cannot get Carts", err);
    }
  }

  async deleteCart(cartId) {
    try {
      const cart = await this.cartRepository.findByIdAndDelete(cartId);

      return cart;
    } catch (err) {
      console.log("DB Error >> Cannot delete Cart", err);
    }
  }

  async updateCart(cartId, newData) {
    try {
      const cart = await this.cartRepository.findByIdAndUpdate(cartId, newData);
      return cart;
    } catch (err) {
      console.log("DB Error >> Cannot Update Cart", err);
    }
  }

  async getCartByKey(key) {
    try {
      const cart = await this.cartRepository.findOne(key);
      return cart; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting Cart by ${key}`, err);
    }
  }

  async getAllCartsExceptOne(key) {
    try {
      const cart = await this.cartRepository.find(key);
      return cart; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting carts`, err);
    }
  }
}

module.exports = CartService;
