const CatalogRepository = require("../repositories/catalogRepository");
const SubCategory = require("../models/subCategoryModel")
class SubCategoryService { 
  constructor() {
    this.subCategoryRepository = new CatalogRepository(SubCategory); 
  }

  async createSubCategory(subCategory) { 
    try {
      const createdSubCategory = await this.subCategoryRepository.create(subCategory); 
      return createdSubCategory;
    } catch (err) {
      console.log("DB Error >> Cannot create SubCategory", err); 
    }
  }

  async getSubCategoryById(subCategoryId) { 
    try {
      const subCategory = await this.subCategoryRepository.findById(subCategoryId); 
      return subCategory;
    } catch (err) {
      console.log("DB Error >> Cannot get SubCategory", err); 
    }
  }

  async getSubCategories() { 
    try {
      const subCategories = await this.subCategoryRepository.findAll(); 
      return subCategories;
    } catch (err) {
      console.log("DB Error >> Cannot get subCategories", err); 
    }
  }

  async deleteSubCategory(subCategoryId) { 
    try {
      const subCategory = await this.subCategoryRepository.findByIdAndDelete(subCategoryId); // Change variable names
      return subCategory;
    } catch (err) {
      console.log("DB Error >> Cannot delete SubCategory", err);
    }
  }

  async updateSubCategory(subCategoryId, newData) { 
      const subCategory = await this.subCategoryRepository.findByIdAndUpdate(
        subCategoryId,
        newData
      ); 
      return subCategory;
    } catch (err) {
      console.log("DB Error >> Cannot Update SubCategory", err); 
  }

  async getSubCategoryByKey(key) { 
    try {
      const subCategory = await this.subCategoryRepository.find(key); 
      return subCategory; 
    } catch (err) {
      console.log(`Database error while getting subCategory by ${key}`, err); 
    }
  }
  
  async getAllSubCategoriesExceptOne(key) {
    try {
      const subCategory = await this.subCategoryRepository.find(key);
      return subCategory; // Return true if key is unique, false if it already exists
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting categories`, err);
    }
  }
}

module.exports = SubCategoryService;
