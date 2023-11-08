const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const CartService = require("../services/cartService");
// const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");
const axios = require("axios");

const MessagingService = require("../services/messagingService");
const CouponService = require("../services/couponService");

class CartController {
  constructor() {
    this.cartService = new CartService();
    this.couponService=new CouponService();
    

    this.userId = "";
  }

  calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
  };

  // @desc    Add product to  cart
  // @route   POST /api/v1/cart
  // @access  Private/User
  addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color, quantity } = req.body;
    this.userId = req.body.userId;

    // 1) Get Cart for logged user
    let cart = await Cart.findOne({ userId: this.userId });

    const product = await axios.get(
      `${process.env.catalogService}/api/v1/catalog/products/${productId}`
    );
    console.log(product);

    const { price } = product.data.data;
    const stock = product.data.data.quantity;
    const difference = quantity - stock;
    console.log(difference);
    if (difference > 0) {
      next(new ApiError("there is no available quantity from this product"));
    } else {
      if (!cart) {
        // create cart fot logged user with product
        cart = await Cart.create({
          userId: this.userId,
          cartItems: [
            {
              productId: productId,
              color: color,
              price: price,
              quantity: quantity,
            },
          ],
        });
      } else {
        // get the index of the product exist in cart, update product quantity
        const productIndex = cart.cartItems.findIndex(
          (item) =>
            item.productId.toString() === productId && item.color === color
        );

        if (productIndex > -1) {
          // update the quantity for this product
          const cartItem = cart.cartItems[productIndex];
          cartItem.quantity += quantity;

          //replace the old document with the new one
          cart.cartItems[productIndex] = cartItem;
        } else {
          // product not exist in cart,  push product to cartItems array
          cart.cartItems.push({
            productId: productId,
            color: color,
            price: price,
            quantity: quantity,
          });
        }
      }

      // Calculate total cart price
      this.calcTotalCartPrice(cart);
      await cart.save();

      const message = {
        productId: productId,
        color: color,
        quantity: quantity,
      };

      await MessagingService.publishMessage(
        process.env.EXCHANGE_NAME,
        process.env.PUBLISHER_ROUTING_KEY,
        message
      );

      res.status(200).json({
        status: "success",
        message: "Product added to cart successfully",
        numOfCartItems: cart.cartItems.length,
        data: cart,
      });
    }
  });

  // @desc    Get logged user cart
  // @route   GET /api/v1/cart
  // @access  Private/User
  getLoggedUserCart = asyncHandler(async (req, res, next) => {
    this.userId = req.body.userId;

    const cart = await this.cartService.getCartByKey({ userId: this.userId });

    if (!cart) {
      return next(
        new ApiError(`There is no cart for this user id : ${this.userId}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });

  // @desc    Remove specific cart item
  // @route   DELETE /api/v1/cart/:itemId
  // @access  Private/User
  removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await this.cartService.updateCart(
      { userId: this.userId },
      {
        $pull: { cartItems: { _id: req.params.itemId } },
      },
      { new: true }
    );

    calcTotalCartPrice(cart);
    cart.save();

    res.status(200).json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });

  // @desc    clear logged user cart
  // @route   DELETE /api/v1/cart
  // @access  Private/User
  clearCart = asyncHandler(async (req, res, next) => {
    const cart = await this.cartService.getCartByKey({ userId: this.userId });
    await this.cartService.deleteCart(cart._id);
    res.status(204).send();
  });

  // @desc    Update specific cart item quantity
  // @route   PUT /api/v1/cart/:itemId
  // @access  Private/User
  updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;

    const cart = await this.cartService.getCartByKey({ userId: this.userId });
    if (!cart) {
      return next(
        new ApiError(`there is no cart for user ${this.userId}`, 404)
      );
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantity = quantity;
      cart.cartItems[itemIndex] = cartItem;
    } else {
      return next(
        new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
      );
    }

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });

  // @desc    Apply coupon on logged user cart
  // @route   PUT /api/v1/cart/applyCoupon
  // // @access  Private/User
    applyCoupon = asyncHandler(async (req, res, next) => {
      // 1) Get coupon based on coupon name
      const coupon = await this.couponService.getCouponByKey({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
      });

      if (!coupon) {
        return next(new ApiError(`Coupon is invalid or expired`));
      }

      // 2) Get logged user cart to get total cart price
      const cart = await this.cartService.getCartByKey({ userId: req.body.userId });

      const totalPrice = cart.totalCartPrice;

      // 3) Calculate price after priceAfterDiscount
      const totalPriceAfterDiscount = (
        totalPrice -
        (totalPrice * coupon.discount) / 100
      ).toFixed(2); // 99.23

      cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
      await cart.save();

      res.status(200).json({
        status: "success",
        numOfCartItems: cart.cartItems.length,
        data: cart,
      });
    });
}

module.exports = CartController;
