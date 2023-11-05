const StockRepository = require("../repositories/cartRepository");
const Stock = require("../models/stockModel");

class StockService {
  constructor() {
    this.stockService = new StockRepository(Stock);
  }

  async createStock(stock) {
    try {
      const createdStock = await this.stockService.create(stock);
      return createdStock;
    } catch (err) {
      console.log("DB Error >> Cannot Create Stock", err);
    }
  }

  async getStockById(stockId) {
    try {
      const stock = await this.stockService.findById(stockId);
      return stock;
    } catch (err) {
      console.log("DB Error >> Cannot get Stock", err);
    }
  }

  async getAllStocks() {
    try {
      const stocks = await this.stockService.findAll();
      if (stocks) {
        return stocks;
      }
    } catch (err) {
      console.log("DB Error >> Cannot get Stocks", err);
    }
  }

  async deleteStock(stockId) {
    try {
      const stock = await this.stockService.findByIdAndDelete(stockId);

      return stock;
    } catch (err) {
      console.log("DB Error >> Cannot delete Stock", err);
    }
  }

  async updateStock(stockId, newData) {
    try {
      const stock = await this.stockService.findByIdAndUpdate(stockId, newData);
      return stock;
    } catch (err) {
      console.log("DB Error >> Cannot Update Stock", err);
    }
  }

  async getStockByKey(key) {
    try {
      const stock = await this.stockService.findOne(key);
      return stock; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting Stock by ${key}`, err);
    }
  }

  async getAllStocksExceptOne(key) {
    try {
      const stock = await this.stockService.find(key);
      return stock; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while gettingc Stocks`, err);
    }
  }
}

module.exports = StockService;
