const OrderRepository = require("../repositories/orderRepository");
const Order = require("../models/orderModel");

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository(Order);
  }

  async createOrder(order) {
    try {
      const createdOrder = await this.orderRepository.create(order);
      return createdOrder;
    } catch (err) {
      console.log("DB Error >> Cannot Create Order", err);
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await this.orderRepository.findById(orderId);
      return order;
    } catch (err) {
      console.log("DB Error >> Cannot get order", err);
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.orderRepository.findAll();
      if(orders){
        return orders
      }
    } catch (err) {
      console.log("DB Error >> Cannot get orders", err);
    }
  }

  async deleteorder(orderId) {
    try {
      const order = await this.orderRepository.findByIdAndDelete(
        orderId
      );

      return order;
    } catch (err) {
      console.log("DB Error >> Cannot delete Order", err);
    }
  }

  async updateOrder(orderId, newData) {
    try {
      const order = await this.orderRepository.findByIdAndUpdate(
        orderId,
        newData
      );
      return order;
    } catch (err) {
      console.log("DB Error >> Cannot Update Order", err);
    }
  }

  async getOrderByKey(key) {
    try {
      const order = await this.orderRepository.findOne(key);
      return order; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting order by ${key}`, err);
    }
  }

  async getAllOrdersExceptOne(key) {
    try {
      const order = await this.orderRepository.find(key);
      return order; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting orders`, err);
    }
  }
}

module.exports = OrderService;
