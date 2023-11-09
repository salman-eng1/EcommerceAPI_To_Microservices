const ReviewRepository = require("../repositories/reviewRepository");
const Review = require("../models/reviewModel"); // Change import to review
const messagingService = require("./messagingService");

class ReviewService {
  // Change class name to ReviewService
  constructor() {
    this.reviewRepository = new ReviewRepository(Review); // Change repository to reviewRepository
  }

  async createReview(review) {
    try {
      const createdReview = await this.reviewRepository.create(review);
      return createdReview; // Return the created review
    } catch (err) {
   
      console.log("DB Error >> Cannot create review", err);
      throw err; // Rethrow the error so it can be handled by the caller
    }
  }

  async getReviewById(reviewId) {
    // Change method name
    try {
      const review = await this.reviewRepository.findById(reviewId); // Change variable names
      return review;
    } catch (err) {
      console.log("DB Error >> Cannot get review", err); // Change log message
    }
  }

  async getAllReviews() {
    // Change method name
    try {
      const reviews = await this.reviewRepository.findAll(); // Change variable names
      return reviews;
    } catch (err) {
      console.log("DB Error >> Cannot get reviews", err); // Change log message
    }
  }

  async deleteReview(reviewId) {
    // Change method name
    try {
      const review = await this.reviewRepository.findByIdAndDelete(reviewId); // Change variable names
      return review;
    } catch (err) {
      console.log("DB Error >> Cannot delete review", err); // Change log message
    }
  }
  async updateReview(reviewId, newData) {
    try {
      const updatedReview = await this.reviewRepository.findByIdAndUpdate(
        reviewId,
        newData
      );

      return updatedReview; // Return the updated review
    } catch (err) {
      console.log("DB Error >> Cannot Update review", err);
      console.log("An error occurred while updating the review");
    }
  }

  async getReviewByKey(key) {
    // Change method name
    try {
      const review = await this.reviewRepository.findOne(key); // Change variable names
      return review; // Change variable names
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting review by ${key}`, err); // Change log message
    }
  }
}

module.exports = ReviewService;
