const SubCategory = require("../models/subCategoryModel");
const factory = require("../../../../shared/handlers/handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next(); //to move to the next middleware
};

exports.createSubCategory = factory.createOne(SubCategory);

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) 
  filterObject = { category: req.params.categoryId };
req.filterObject=filterObject;
  next();
};

exports.getSubCategories = factory.getAll(SubCategory)


exports.getSubCategory = factory.getOne(SubCategory)

exports.updateSubCategory = factory.updateOne(SubCategory);

exports.deleteSubCategory = factory.deleteOne(SubCategory);
