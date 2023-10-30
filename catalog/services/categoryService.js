const CatalogRepository = require("../repositories/catalogRepository");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");

class CategoryService {
  constructor() {
    this.categoryRepository = new CatalogRepository(Category);
  }

  async createCategory(category, name) {
    try {
      const createdCategory = await this.categoryRepository.create(category);
      return createdCategory;
    } catch (err) {
      console.log("DB Error >> Cannot Create Category", err);
    }
  }

  async getCategoryById(categoryId) {
    try {
      const category = await this.categoryRepository.findById(categoryId);
      return category;
    } catch (err) {
      console.log("DB Error >> Cannot get Category", err);
    }
  }

  async getAllCategories() {
    try {
      const categories = await this.categoryRepository.findAll();
      if(categories){
        return categories
      }
    } catch (err) {
      console.log("DB Error >> Cannot get Categories", err);
    }
  }

  async deleteCategory(categoryId) {
    try {
      const category = await this.categoryRepository.findByIdAndDelete(
        categoryId
      );

      return category;
    } catch (err) {
      console.log("DB Error >> Cannot delete Category", err);
    }
  }

  async updateCategory(categoryId, newData) {
    try {
      const category = await this.categoryRepository.findByIdAndUpdate(
        categoryId,
        newData
      );
      return category;
    } catch (err) {
      console.log("DB Error >> Cannot Update Category", err);
    }
  }

  async getCategoryByKey(key) {
    try {
      const category = await this.categoryRepository.findOne(key);
      return category; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting category by ${key}`, err);
    }
  }

  async getAllCategoriesExceptOne(key) {
    try {
      const category = await this.categoryRepository.find(key);
      return category; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting categories`, err);
    }
  }
}

module.exports = CategoryService;
