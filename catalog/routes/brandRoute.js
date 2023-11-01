const express = require("express");
const BrandValidator = require("../utils/validators/brandValidator");
const BrandController = require("../controllers/brandController");
const IsAuthenticated = require("../middlewares/isAuthenticated");
const isAuthenticated = new IsAuthenticated();
const brandController = new BrandController();
const brandValidator = new BrandValidator();

const router = express.Router();

//get all sub categories for specific parent Brand by its ID

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    brandValidator.createBrandValidator,
    brandController.createBrand
  );
router
  .route("/:id")
  .get(brandValidator.getBrandValidator, brandController.getBrand)
  .put(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    brandValidator.updateBrandValidator,
    brandController.updateBrand
  )
  .delete(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    brandValidator.deleteBrandValidator,
    brandController.deleteBrand
  );
module.exports = router;
