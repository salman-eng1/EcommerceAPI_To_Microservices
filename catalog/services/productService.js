const CatalogRepository = require("../repositories/catalogRepository");
const Product = require("../models/productModel"); // Change import to Product
const messagingService = require("./messagingService");

class ProductService {
  // Change class name to ProductService
  constructor() {
    this.productRepository = new CatalogRepository(Product); // Change repository to productRepository
  }

  async createProduct(product) {
    try {
      const createdProduct = await this.productRepository.create(product);
      return createdProduct; // Return the created product
    } catch (err) {
      console.log(
        "error sending product information message when the product is created"
      );
      console.log("DB Error >> Cannot create Product", err);
      throw err; // Rethrow the error so it can be handled by the caller
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
    try {
      const updatedProduct = await this.productRepository.findByIdAndUpdate(
        productId,
        newData
      );

      return updatedProduct; // Return the updated product
    } catch (err) {
      console.log("DB Error >> Cannot Update Product", err);
         console.log("An error occurred while updating the product")
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
