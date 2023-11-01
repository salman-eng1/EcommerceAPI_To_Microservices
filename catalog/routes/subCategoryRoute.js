const express = require("express");
const SubCategoryController = require("../controllers/subCategoryController");
const IsAuthenticated = require("../middlewares/isAuthenticated");
const SubCategoryValidator = require("../utils/validators/subCategoryValidator");
const subCategoryValidator = new SubCategoryValidator();

const subCategoryController = new SubCategoryController();

const isAuthenticated = new IsAuthenticated();

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    subCategoryController.setCategoryIdToBody,
    subCategoryValidator.createSubCategoryValidator,
    subCategoryController.createSubCategory
  )
  .get(
    subCategoryController.createFilterObj,
    subCategoryController.getSubCategories
  );

router
  .route("/:id")
  .get(
    subCategoryValidator.getSubCategoryValidator,
    subCategoryController.getSubCategory
  )
  .put(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory
  );
module.exports = router;
