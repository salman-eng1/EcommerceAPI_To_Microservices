// const express = require("express");
// const {
//   getProductValidator,
//   createProductValidator,
//   updateProductValidator,
//   deleteProductValidator,
// } = require("../utils/validators/productValidator");

// const {
//   getProducts,
//   getProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   uploadProductImages,
//   resizeProductImage,
//   sendMsgToQueue
// } = require("../controllers/productController");

// const handlerFactory = require("../../../../shared/handlers/handlerFactory");
// // const reviewsRoute = require("./reviewRoute");

// const router = express.Router();

// // POST   /products/jkshjhsdjh2332n/reviews
// // GET    /products/jkshjhsdjh2332n/reviews
// // GET    /products/jkshjhsdjh2332n/reviews/87487sfww3


// // router.use("/:productId/reviews", reviewsRoute);

// router
//   .route("/")
//   .get(getProducts)
//   .post(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     // uploadProductImages,
//     // resizeProductImage,
//     createProductValidator,
//     createProduct,
//     sendMsgToQueue
//   );
// router
//   .route("/:id")
//   .get(getProductValidator, getProduct)
//   .put(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     uploadProductImages,
//     resizeProductImage,
//     updateProductValidator,
//     updateProduct
//   )
//   .delete(
//     handlerFactory.protectService,
//     handlerFactory.allowedTo("admin", "manager"),
//     deleteProductValidator,
//     deleteProduct
//   );

// module.exports = router;
