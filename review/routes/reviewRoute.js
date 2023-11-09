const express = require("express");
const IsAuthenticated = require("../middlewares/isAuthenticated");
const ReviewController = require("../controllers/reviewController");
const ReviewValidator = require("../utils/validator/reviewValidator");

const reviewController = new ReviewController();
const isAuthenticated = new IsAuthenticated();
const reviewValidator = new ReviewValidator();


const router = express.Router({ mergeParams: true });
router
  .route("/:productId/reviews")
  .get(reviewController.createFilterObj, reviewController.getReviews)
  .post(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("user"),
    reviewController.setProductIdAndUserIdToBody,
    reviewValidator.createReviewValidator,
    reviewController.createReview
  );
  
router
  .route("/")
  .get(reviewController.createFilterObj, reviewController.getReviews)
  .post(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("user"),
    reviewController.setProductIdAndUserIdToBody,
    reviewValidator.createReviewValidator,
    reviewController.createReview
  );
router
  .route("/:id")
  .get(reviewValidator.getReviewValidator, reviewController.getReview)
  .put(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("user"),
    reviewValidator.updateReviewValidator,
    reviewController.updateReview
  )
  .delete(
    isAuthenticated.protectService,
    isAuthenticated.allowedTo("user", "manager", "admin"),
    reviewValidator.deleteReviewValidator,
    reviewController.deleteReview
  );

module.exports = router;
