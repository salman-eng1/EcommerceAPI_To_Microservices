const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const MessagingService = require("../services/messagingService");

const CouponService = require("../services/couponService");

class CouponController{
constructor(){
    this.couponService=new CouponService()
}
// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin-Manager
getCoupons =  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const couponsCounts = await Coupon.countDocuments();
    const apiFeatures = new ApiFeatures(Coupon.find(filter), req.query)
      .paginate(couponsCounts)
      .filter()
      .search(Coupon)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const coupons = await mongooseQuery;

    res
      .status(200)
      .json({ results: coupons.length, paginationResult, data: coupons });
  });


// @desc    Get specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin-Manager
getCoupon =  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = this.couponService.getCouponById(id);
    // if (populationOpt) {
    //   query = query.populate(populationOpt);
    // }

    // 2) Execute query
    const coupon = await query;

    if (!coupon) {
      return next(new ApiError(`No coupon for this id ${id}`, 404));
    }
    res.status(200).json({ data: coupon });
  });
// @desc    Create coupon
// @route   POST  /api/v1/coupons
// @access  Private/Admin-Manager
createCoupon = asyncHandler(async (req, res) => {
    const createdCoupon = await this.couponService.createCoupon(req.body);

    if(createdCoupon){
      
    }
    const message={
      couponId: createdCoupon.id,
      name: createdCoupon.name,
      expire: createdCoupon.expire,
      discount: createdCoupon.discount
    }
    await MessagingService.publishMessage(
      process.env.EXCHANGE_NAME,
      process.env.BASKET_ROUTING_KEY,
      message
    );
    res.status(201).json({ data: createdCoupon });
  });

// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin-Manager
updateCoupon =  asyncHandler(async (req, res, next) => {
    const coupon = await this.couponService.updateCoupon(req.params.id, req.body);

    if (!coupon) {
      return next(
        new ApiError(`No coupon for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update coupon
    res.status(200).json({ data: coupon });
  });

// @desc    Delete specific coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin-Manager
deleteCoupon =  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await this.couponService.deleteCoupon(id);

    if (!coupon) {
      return next(new ApiError(`No coupon for this id ${id}`, 404));
    }

    // Trigger "remove" event when update coupon
    res.status(204).send();
  });
}

module.exports=CouponController