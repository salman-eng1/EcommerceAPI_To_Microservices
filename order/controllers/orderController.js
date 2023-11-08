const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { axiosRequest } = require("../utils/axios");
const OrderService = require("../services/orderService");
const Order = require("../models/orderModel");
const ApiFeatures = require("../utils/apiFeatures");
const messagingService = require("../services/messagingService");

// const Product = require("../models/productModel");

class OrderController {
  constructor() {
    this.orderService = new OrderService();
    this.token;
  }

  // @desc    create cash order
  // @route   POST /api/v1/orders/cartId
  // @access  Protected/User
  createCashOrder = asyncHandler(async (req, res, next) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      this.token = req.headers.authorization.split(" ")[1];
    }
    if (!this.token) {
      return next(
        new ApiError(
          "You are not logged in, Please login to get access this route",
          401
        )
      );
    }
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    const getCartData = await axiosRequest(
      "get",
      `${process.env.cartService}/api/v1/cart`,
      this.token
    );

    const cart = getCartData.data.data;

    if (!cart) {
      return next(
        new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
      );
    }

    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const message = {
      productId: [],
      soldQty: [],
    };

    // 3) Create order with default paymentMethodType cash
    const order = await this.orderService.createOrder({
      userId: req.body.userId,
      cartItems: cart.cartItems,
      shippingAddress: req.body.shippingAddress,
      totalOrderPrice,
    });

    if (order) {
      order.cartItems.forEach((item) => {
        message.productId.push(item.productId);
        message.soldQty.push(item.quantity);
      });

      messagingService.publishMessage(
        process.env.EXCHANGE_NAME,
        process.env.CATALOG_ROUTING_KEY,
        message
      );
      const removeCart = await axiosRequest(
        "delete",
        `${process.env.cartService}/api/v1/cart`,
        this.token
      )
    }

    res.status(201).json({ status: "success", data: order });
  });

  filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    console.log(req.body);

    if (req.body.role === "user") req.filterObj = { user: req.body.userId };
    next();
  });

  // @desc    Get all orders
  // @route   POST /api/v1/orders
  // @access  Protected/User-Admin-Manager
  findAllOrders = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Order.countDocuments();
    const apiFeatures = new ApiFeatures(
      this.orderService.getFilteredOrders(filter),
      req.query
    )
      .paginate(documentsCounts)
      .filter()
      .search(Order)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

  // // @desc    Get all orders
  // // @route   POST /api/v1/orders
  // // @access  Protected/User-Admin-Manager
  findSpecificOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = this.orderService.getOrderById(id);
    console.log(query);
    // if (populationOpt) {
    //   query = query.populate(populationOpt);
    // }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No order for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

  // // @desc    Update order paid status to paid
  // // @route   PUT /api/v1/orders/:id/pay
  // // @access  Protected/Admin-Manager
  updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await this.orderService.getOrderById(req.params.id);
    if (!order) {
      return next(
        new ApiError(
          `There is no such a order with this id:${req.params.id}`,
          404
        )
      );
    }

    //   // update order to paid
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ status: "success", data: updatedOrder });
  });

  // // @desc    Update order delivered status
  // // @route   PUT /api/v1/orders/:id/deliver
  // // @access  Protected/Admin-Manager
  updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await this.orderService.getOrderById(req.params.id);
    if (!order) {
      return next(
        new ApiError(
          `There is no such a order with this id:${req.params.id}`,
          404
        )
      );
    }

    // update order to paid
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ status: "success", data: updatedOrder });
  });

  // // @desc    Get checkout session from stripe and send it as response
  // // @route   GET /api/v1/orders/checkout-session/cartId
  // // @access  Protected/User
  checkoutSession = asyncHandler(async (req, res, next) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      this.token = req.headers.authorization.split(" ")[1];
    }
    if (!this.token) {
      return next(
        new ApiError(
          "You are not logged in, Please login to get access this route",
          401
        )
      );
    }
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    let cart = await axiosRequest(
      "get",
      `${process.env.cartService}/api/v1/cart`,
      this.token
    );
    if (!cart) {
      return next(
        new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
      );
    }
cart=cart.data.data
    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    // 3) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            product_data: {
              name: "productName",
            },
            unit_amount: totalOrderPrice * 100,
            currency: "USD",
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get(
        `${process.env.BASE_URL}`
      )}/orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/cart`,
      customer_email: req.body.userEmail,
      client_reference_id: req.params.cartId,
      metadata: req.body.shippingAddress,
    });

    // 4) send session to response
    res.status(200).json({ status: "success", session });
  });

  createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const oderPrice = session.amount_total / 100;

    const cart = await axiosRequest(
      "get",
      `${process.env.cartService}/api/v1/cart`,
      this.token
    );
    const user = await axiosRequest(
      "get",
      `${process.env.authService}/api/v1/users/getMe`,
      this.token
    );
    // 3) Create order with default paymentMethodType card
    const order = await Order.create({
      user: user.data.data_id,
      cartItems: cart.data.data.cartItems,
      shippingAddress,
      totalOrderPrice: oderPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentMethodType: "card",
    });



  };

  // @desc    This webhook will run when stripe payment success paid
  // @route   POST /webhook-checkout
  // @access  Protected/User
  webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log("ssssssssssssssssssssssssssssssssssss")
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      //  Create order
      createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
  });
}

module.exports = OrderController;
