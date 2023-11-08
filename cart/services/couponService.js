const CouponRepository = require("../repositories/cartRepository");
const Coupon = require("../models/couponModel"); // Change import to coupon
const messagingService = require("./messagingService");

class CouponService {
  // Change class name to CouponService
  constructor() {
    this.couponRepository = new CouponRepository(Coupon); // Change repository to couponRepository
  }

  async createCoupon(coupon) {
    try {
      const createdCoupon = await this.couponRepository.create(coupon);
      return createdCoupon; // Return the created coupon
    } catch (err) {
      console.log(
        "error sending coupon information message when the coupon is created"
      );
      console.log("DB Error >> Cannot create coupon", err);
      throw err; // Rethrow the error so it can be handled by the caller
    }
  }

  async getCouponById(couponId) {
    // Change method name
    try {
      const coupon = await this.couponRepository.findById(couponId); // Change variable names
      return coupon;
    } catch (err) {
      console.log("DB Error >> Cannot get coupon", err); // Change log message
    }
  }

  async getAllCoupons() {
    // Change method name
    try {
      const coupons = await this.couponRepository.findAll(); // Change variable names
      return coupons;
    } catch (err) {
      console.log("DB Error >> Cannot get coupons", err); // Change log message
    }
  }

  async deleteCoupon(couponId) {
    // Change method name
    try {
      const coupon = await this.couponRepository.findByIdAndDelete(couponId); // Change variable names
      return coupon;
    } catch (err) {
      console.log("DB Error >> Cannot delete coupon", err); // Change log message
    }
  }
  async updateCoupon(couponId, newData) {
    try {
      const updatedCoupon = await this.couponRepository.findByIdAndUpdate(
        couponId,
        newData
      );

      return updatedCoupon; // Return the updated coupon
    } catch (err) {
      console.log("DB Error >> Cannot Update coupon", err);
         console.log("An error occurred while updating the coupon")
    }
  }

  async getCouponByKey(key) {
    // Change method name
    try {
      const coupon = await this.couponRepository.findOne(key); // Change variable names
      return coupon; // Change variable names
    } catch (err) {
      // Handle database error, log, or throw an exception if needed
      console.log(`Database error while getting coupon by ${key}`, err); // Change log message
    }
  }
}

module.exports = CouponService;
