const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const CategoryService = require("../services/categoryService");

dotenv.config(".env");

class IsAuthenticated {
  constructor() {
    this.categoryService = new CategoryService();
    this.decoded = this.decoded;
    this.role=this.role
  }

  protectService = asyncHandler(async (req, res, next) => {
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
    // 2) Verify token (no change happens, expired token)
    this.decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const response = await axios({
      method: "get",
      url: `${process.env.authService}/api/v1/users/${this.decoded.userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        this.role =response.data.data.role;
      })
      .catch((err) => {
        throw new ApiError(
          err.message,
          401
        );
      });

    next();
  });

  // @desc    Authorization (User Permissions)
  // ["admin", "manager"]
  allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
      console.log(this.role)
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
