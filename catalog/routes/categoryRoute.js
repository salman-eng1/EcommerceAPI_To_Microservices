const express = require("express");
const CategoryController = require("../controllers/categoryController");
const subCategoriesRoute = require("./subCategoryRoute");
const IsAuthenticated = require("../middlewares/isAuthenticated");
const CategoryValidator=require("../utils/validators/categoryValidator")
const isAuthenticated = new IsAuthenticated();
const categoryController = new CategoryController();
const categoryValidator=new CategoryValidator()
const router = express.Router();

//get all sub categories for specific parent category by its ID
router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    categoryValidator.createCategoryValidator,
    categoryController.createCategory
  );
router
  .route("/:id")
  .get(categoryValidator.getCategoryValidator, categoryController.getCategory)
  .put(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory
  );
module.exports = router;
