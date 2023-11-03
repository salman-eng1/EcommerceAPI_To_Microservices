const express = require("express");

const CartController = require("../controllers/cartController");
const IsAuthenticated = require("../middlewares/isAuthenticated");

const cartController=new CartController()
const isAuthenticated=new IsAuthenticated()

const router = express.Router();

router.use(isAuthenticated.protectService, isAuthenticated.allowedTo("user"));
router
  .route("/")
  .post(cartController.addProductToCart)
  .get(cartController.getLoggedUserCart)
  .delete(cartController.clearCart);

// router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(cartController.updateCartItemQuantity)
  .delete(cartController.removeSpecificCartItem);

module.exports = router;
