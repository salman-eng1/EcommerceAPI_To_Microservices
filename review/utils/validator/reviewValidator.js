const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");
const ReviewService = require("../../services/reviewService");

class ReviewValidator {
  constructor(decoded) {
    this.reviewService = new ReviewService();
    this.decoded = decoded;
  }

  createReviewValidator = [
    check("title").optional(),
    check("ratings")
      .notEmpty()
      .withMessage("ratings value required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Ratings value must be between 1 to 5"),
    check("user").isMongoId().withMessage("Invalid user id format"),
    check("product")
      .isMongoId()
      .withMessage("Invalid Review id format")
      .custom((val, { req }) =>
        // Check if logged user create review before

        this.reviewService
          .getReviewByKey({
            user: req.body.user,
            product: req.params.productId || req.body.product,
          })
          .then((review) => {
            if (review) {
              return Promise.reject(
                new Error("You already created a review before")
              );
            }
          })
      ),
    validatorMiddleware,
  ];

  getReviewValidator = [
    check("id").isMongoId().withMessage("Invalid Review id format"),
    validatorMiddleware,
  ];

  updateReviewValidator = [
    check("id")
      .isMongoId()
      .withMessage("Invalid Review id format")
      .custom((val, { req }) =>
        // Check review ownership before update
        this.reviewService.getReviewById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }

          if (review.user.toString() !== req.body.user) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        })
      ),
    validatorMiddleware,
  ];

  deleteReviewValidator = [
    check("id")
      .isMongoId()
      .withMessage("Invalid Review id format")
      .custom((val, { req }) => {
        // Check review ownership before update
        this.reviewService.getReviewById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (review.user.toString() !== req.body.user) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });

        return true;
      }),
    validatorMiddleware,
  ];
}

module.exports = ReviewValidator;
