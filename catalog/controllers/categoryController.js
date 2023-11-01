const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

const Category = require("../models/categoryModel");
const CategoryService = require("../services/categoryService");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddlware");

dotenv.config(".env");

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  //Memory Storage
  uploadCategoryImage = uploadSingleImage("image");

  // use memory storage only when you have to process the image
  resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${fileName}`);

      req.body.image = fileName;
    }
    next();
  });

  // @desc     createCategory
  //@route     POST .api/v1/categories
  //access     private
  createCategory = asyncHandler(async (req, res) => {
    const createdCategory = await this.categoryService.createCategory(req.body);
    res.status(201).json({ data: createdCategory });
  });
  // exports.sendToRabbitMQ=()=>{
  //   const category=Category.findOne(req.body.name)
  // }

  // @desc     update specific Category
  //@route     PUT .api/v1/categories/:id
  //access     private

  updateCategory = asyncHandler(async (req, res, next) => {
    const updatedCategory = await this.categoryService.updateCategory(
      req.params.id,
      req.body
    );

    if (!updatedCategory) {
      return next(
        new ApiError(`No category for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: updatedCategory });
  });
  // @desc     update specific Category
  //@route     DELETE /api/v1/categories/:id
  //access     private

  deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedCategory = await this.categoryService.deleteCategory(id);

    if (!deletedCategory) {
      return next(new ApiError(`No category for this id ${id}`, 404));
    }

    res.status(204).send();
  });

  // @desc     get list of categories
  //@route     GET .api/v1/categories
  //access     public
  getCategories = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const categoriesCounts = await Category.countDocuments();
    const apiFeatures = new ApiFeatures(Category.find(filter), req.query)
      .paginate(categoriesCounts)
      .filter()
      .search("Category")
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const categories = await mongooseQuery;

    res
      .status(200)
      .json({ results: categories.length, paginationResult, data: categories });
  });

  // @desc     getCategoryById
  //@route     GET .api/v1/categories/:id
  //access     public
  getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = await this.categoryService.getCategoryById(id);

    // 2) Execute query
    const category = await query;

    if (!category) {
      return next(new ApiError(`No category for this id ${id}`, 404));
    }
    res.status(200).json({ data: category });
  });
}
module.exports = CategoryController;
