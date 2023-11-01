const express = require("express");
const ProductController=require("../controllers/productController")
const ProductValidator=require("../utils/validators/productValidator")
const IsAuthenticated=require("../middlewares/isAuthenticated")
const productController=new ProductController()
const productValidator=new ProductValidator
const isAuthenticated=new IsAuthenticated()

// const reviewsRoute = require("./reviewRoute");

const router = express.Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3

// router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get( productController.getProducts)
  .post(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.resizeProductImage,
    productValidator.createProductValidator,
    productController.createProduct,
    // productController.sendMsgToQueue
  );
router
  .route("/:id")
  .get( productValidator.getProductValidator,  productController.getProduct)
  .put(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.resizeProductImage,
    productValidator.updateProductValidator,
    productController. updateProduct
  )
  .delete(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("admin", "manager"),
    productValidator.deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
