// const express = require("express");

// const router = express.Router({ mergeParams: true });

// const {
//   createSubCategory,
//   getSubCategories,
//   getSubCategory,
//   updateSubCategory,
//   deleteSubCategory,
//   setCategoryIdToBody,
//   createFilterObj,
// } = require("../controllers/subCategoryController");
// const {
//   createSubCategoryValidator,
//   getSubCategoryValidator,
//   updateSubCategoryValidator,
//   deleteSubCategoryValidator,
// } = require("../utils/validators/subCategoryValidator");

// const handlerFactory = require("../../../../shared/handlers/handlerFactory");

// router
//   .route("/")
//   .post(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     setCategoryIdToBody,
//     createSubCategoryValidator,
//     createSubCategory
//   )
//   .get(createFilterObj, getSubCategories);

// router
//   .route("/:id")
//   .get(getSubCategoryValidator, getSubCategory)
//   .put(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     updateSubCategoryValidator,
//     updateSubCategory
//   )
//   .delete(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     deleteSubCategoryValidator,
//     deleteSubCategory
//   );
// module.exports = router;
