const CatalogRepository = require("../repositories/catalogRepository");
const Product = require("../models/productModel"); // Change import to Product

class ProductService {
  // Change class name to ProductService
  constructor() {
    this.productRepository = new CatalogRepository(Product); // Change repository to productRepository
  }

  async createProduct(product) {
    // Change method name
    try {
      const createdProduct = await this.productRepository.create(product); // Change variable names
      return createdProduct;
    } catch (err) {
      console.log("DB Error >> Cannot create Product", err); // Change log message
    }
  }

  async getProductById(productId) {
    // Change method name
    try {
      const product = await this.productRepository.findById(productId); // Change variable names
      return product;
    } catch (err) {
      console.log("DB Error >> Cannot get Product", err); // Change log message
    }
  }

  async getAllProducts() {
    // Change method name
    try {
      const products = await this.productRepository.findAll(); // Change variable names
      return products;
    } catch (err) {
      console.log("DB Error >> Cannot get Products", err); // Change log message
    }
  }

  async deleteProduct(productId) {
    // Change method name
    try {
      const product = await this.productRepository.findByIdAndDelete(productId); // Change variable names
      return product;
    } catch (err) {
      console.log("DB Error >> Cannot delete Product", err); // Change log message
    }
  }

  async updateProduct(productId, newData) {
    // Change method name
    try {
      const product = await this.productRepository.findByIdAndUpdate(
        productId,
        newData
      ); // Change variable names
      return product;
    } catch (err) {
      console.log("DB Error >> Cannot Update Product", err); // Change log message
    }
  }

  async getProductByKey(key) {
    // Change method name
    try {
      const product = await this.productRepository.findOne(key); // Change variable names
      return product; // Change variable names
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting product by ${key}`, err); // Change log message
    }
  }
}

module.exports = ProductService;
