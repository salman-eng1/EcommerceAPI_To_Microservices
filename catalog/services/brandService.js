const CatalogRepository = require("../repositories/catalogRepository");
const Brand = require("../models/brandModel"); // Change import to Brand

class BrandService { // Change class name to BrandService
  constructor() {
    this.brandRepository = new CatalogRepository(Brand); // Change repository to brandRepository
  }

  async createBrand(brand) { // Change method name
    try {
      const createdBrand = await this.brandRepository.create(brand); // Change variable names
      return createdBrand;
    } catch (err) {
      console.log("DB Error >> Cannot create Brand", err); // Change log message
    }
  }

  async getBrandById(brandId) { // Change method name
    try {
      const brand = await this.brandRepository.findById(brandId); // Change variable names
      return brand;
    } catch (err) {
      console.log("DB Error >> Cannot get Brand", err); // Change log message
    }
  }

  async getAllBrands() { // Change method name
    try {
      const brands = await this.brandRepository.findAll(); // Change variable names
      return brands;
    } catch (err) {
      console.log("DB Error >> Cannot get Brands", err); // Change log message
    }
  }

  async deleteBrand(brandId) { // Change method name
    try {
      const brand = await this.brandRepository.findByIdAndDelete(brandId); // Change variable names
      return brand;
    } catch (err) {
      console.log("DB Error >> Cannot delete Brand", err); // Change log message
    }
  }

  async updateBrand(brandId, newData) { // Change method name
    try {
      const brand = await this.brandRepository.findByIdAndUpdate(brandId, newData); // Change variable names
      return brand;
    } catch (err) {
      console.log("DB Error >> Cannot Update Brand", err); // Change log message
    }
  }

  async getBrandByKey(key) { // Change method name
    try {
      const brand = await this.brandRepository.findOne(key); // Change variable names
      return brand; // Change variable names
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting brand by ${key}`, err); // Change log message
    }
  }
}

module.exports = BrandService;
