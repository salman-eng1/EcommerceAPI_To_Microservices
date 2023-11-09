const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const ApiError = require("../utils/apiError");
const { axiosRequest } = require("../utils/axios");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const CouponService = require("../services/reviewService");
const ReviewValidator = require("../utils/validator/reviewValidator");

dotenv.config(".env");

class IsAuthenticated {
  constructor() {
    this.couponService = new CouponService();
    this.decoded = this.decoded;
    this.role = this.role;
    this.validator=new ReviewValidator(this.decoded)
  }

  protectService = asyncHandler(async (req, res, next) => {
    try {
      // 1) Check if token exist, if exist get
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return next(
          new ApiError(
            "You are not logged in, Please login to get access this route",
            401
          )
        );
      }
      this.decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const response = await axiosRequest(
        "get",
        `${process.env.authService}/api/v1/users/getMe`,
        token
      );
      this.role = response.data.data.role;
      req.body.user=response.data.data._id
      next();
    } catch (err) {
      const message = err.response.data.message;
      const status = err.response.status;
      next(new ApiError(message, status));
    }
  });

  // @desc    Authorization (User Permissions)
  // ["admin", "manager"]
  allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
      // 1) access roles
      // 2) access registered user (req.user.role)
      if (!roles.includes(this.role)) {
        return next(
          new ApiError("You are not allowed to access this route", 403)
        );
      }
      next();
    });
}

module.exports = IsAuthenticated;
