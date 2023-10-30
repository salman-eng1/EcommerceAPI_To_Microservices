const express = require("express");
const CategoryController = require("../controllers/categoryController");
// const subCategoriesRoute = require("./subCategoryRoute");
const IsAuthenticated = require("../middlewares/isAuthenticated");
const isAuthenticated = new IsAuthenticated();
const categoryController = new CategoryController();

const router = express.Router();
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories = categoryController.getCategories,
  getCategory = categoryController.getCategory,
  createCategory = categoryController.createCategory,
  uploadCategoryImage = categoryController.uploadCategoryImage,
  resizeImage = categoryController.resizeImage,
  updateCategory = categoryController.updateCategory,
  deleteCategory = categoryController.deleteCategory,
} = require("../controllers/categoryController");

//get all sub categories for specific parent category by its ID
// router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategory
  );
module.exports = router;
