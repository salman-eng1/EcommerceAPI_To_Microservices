const SubCategory = require("../models/subCategoryModel");
const SubCategoryService = require("../services/subCategoryService");
const ApiFeatures=require("../utils/apiFeatures")
const ApiError=require("../utils/apiError")

const asyncHandler=require("express-async-handler")

class SubCategoryController {
  constructor() {
    this.subCategoryService = new SubCategoryService();
  }

  // Nested route (Create)

  setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next(); //to move to the next middleware
  };
  // @desc    Create subCategory
  // @route   POST  /api/v1/subcategories
  // @access  Private
  createSubCategory = asyncHandler(async (req, res, next) => {
    const createdSubCategory = await this.subCategoryService.createSubCategory(req.body);
    res.status(201).json({ data: createdSubCategory });
  });

  // Nested route
  // GET /api/v1/categories/:categoryId/subcategories
  createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId)
      filterObject = { category: req.params.categoryId };
    req.filterObject = filterObject;
    next();
  };

  // @desc    Get list of subcategories
  // @route   GET /api/v1/subcategories
  // @access  Public
  getSubCategories = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const subCategoriesCounts = await SubCategory.countDocuments();
    const apiFeatures = new ApiFeatures(SubCategory.find(filter), req.query)
      .paginate(subCategoriesCounts)
      .filter()
      .search("SubCategory")
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const subCategories = await mongooseQuery;

    res
      .status(200)
      .json({ results: subCategories.length, paginationResult, data: subCategories });
  });

  // @desc    Get specific subcategory by id
  // @route   GET /api/v1/subcategories/:id
  // @access  Public
  getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = await this.subCategoryService.getSubCategoryById(id);
    // if (populationOpt) {
      // query = query.populate(populationOpt);
    // }
    // 2) Execute query
    const subCategory = await query;

    if (!subCategory) {
      return next(new ApiError(`No subCategory for this id ${id}`, 404));
    }
    res.status(200).json({ data: subCategory });
  });

  // @desc    Update specific subcategory
  // @route   PUT /api/v1/subcategories/:id
  // @access  Private
  updateSubCategory = asyncHandler(async (req, res, next) => {
    const subCategory = await this.subCategoryService.updateSubCategory(req.params.id, req.body);

    if (!subCategory) {
      return next(
        new ApiError(`No subCategory for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    subCategory.save();
    res.status(200).json({ data: subCategory });
  });

  // @desc    Delete specific subCategory
  // @route   DELETE /api/v1/subcategories/:id
  // @access  Private
  deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await this.subCategoryService.deleteSubCategory(id);

    if (!subCategory) {
      return next(new ApiError(`No subCategory for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    res.status(204).send();
  });
}

module.exports=SubCategoryController
