// const express = require("express");

// const router = express.Router();
// const {
//   getBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
//   createBrandValidator,
// } = require("../utils/validators/brandValidator");
// const {
//   getBrands,
//   createBrand,
//   getBrand,
//   updateBrand,
//   deleteBrand,
//   uploadBrandImage,
//   resizeImage,
// } = require("../controllers/brandController");

// //get all sub categories for specific parent Brand by its ID
// const handlerFactory = require("../../../../shared/handlers/handlerFactory");

// router
//   .route("/")
//   .get(getBrands)
//   .post(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     uploadBrandImage,
//     resizeImage,
//     createBrandValidator,
//     createBrand
//   );
// router
//   .route("/:id")
//   .get(getBrandValidator, getBrand)
//   .put(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     uploadBrandImage,
//     resizeImage,
//     updateBrandValidator,
//     updateBrand
//   )
//   .delete(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     deleteBrandValidator,
//     deleteBrand
//   );
// module.exports = router;
