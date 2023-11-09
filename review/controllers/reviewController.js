const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const MessagingService = require("../services/messagingService");

const ReviewService = require("../services/reviewService");

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }


  createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
  };

// Nested route (Create) (in reviewsRoute, the merge)
setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

  // @desc    Get list of reviews
  // @route   GET /api/v1/reviews
  // @access  Private/Admin-Manager
  getReviews = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const reviewsCounts = await Review.countDocuments();
    const apiFeatures = new ApiFeatures(Review.find(filter), req.query)
      .paginate(reviewsCounts)
      .filter()
      .search(Review)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const reviews = await mongooseQuery;

    res
      .status(200)
      .json({ results: reviews.length, paginationResult, data: reviews });
  });

  // @desc    Get specific review by id
  // @route   GET /api/v1/reviews/:id
  // @access  Private/Admin-Manager
  getReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = this.reviewService.getReviewById(id);
    // if (populationOpt) {
    //   query = query.populate(populationOpt);
    // }

    // 2) Execute query
    const review = await query;

    if (!review) {
      return next(new ApiError(`No review for this id ${id}`, 404));
    }
    res.status(200).json({ data: review });
  });
  // @desc    Create review
  // @route   POST  /api/v1/reviews
  // @access  Private/Admin-Manager
  createReview = asyncHandler(async (req, res,next) => {
    const createdReview = await this.reviewService.createReview(req.body);

    res.status(201).json({ data: createdReview });
  });

  // @desc    Update specific review
  // @route   PUT /api/v1/reviews/:id
  // @access  Private/Admin-Manager
  updateReview = asyncHandler(async (req, res, next) => {
    const review = await this.reviewService.updateReview(
      req.params.id,
      req.body
    );

    if (!review) {
      return next(new ApiError(`No review for this id ${req.params.id}`, 404));
    }
    // Trigger "save" event when update review
    res.status(200).json({ data: review });
  });

  // @desc    Delete specific review
  // @route   DELETE /api/v1/reviews/:id
  // @access  Private/Admin-Manager
  deleteReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await this.reviewService.deleteReview(id);

    if (!review) {
      return next(new ApiError(`No review for this id ${id}`, 404));
    }

    // Trigger "remove" event when update review
    res.status(204).send();
  });
}

module.exports = ReviewController;
