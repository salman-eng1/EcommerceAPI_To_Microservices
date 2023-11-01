const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const createToken = require("../utils/createToken");
const jwt = require("jsonwebtoken");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddlware");
const UserService = require("../services/userService");
const User = require("../models/userModel");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  uploadUserImage = uploadSingleImage("profileImg");

  resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/users/${filename}`);

      // Save image into our db
      req.body.profileImg = filename;
    }

    next();
  });

  // @desc    Get list of users
  // @route   GET /api/v1/users
  // @access  Private/Admin
  getUsers = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const usersCounts = await User.countDocuments();
    const apiFeatures = new ApiFeatures(User.find(filter), req.query)
      .paginate(usersCounts)
      .filter()
      .search(User)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const users = await mongooseQuery;

    res
      .status(200)
      .json({ results: users.length, paginationResult, data: users });
  });

  // @desc    Get specific user by id
  // @route   GET /api/v1/users/:id
  // @access  Private/Admin
  getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    const user = await this.userService.getUserById(id);

    // 2) Execute query

    if (!user) {
      return next(new ApiError(`No user for this id ${id}`, 404));
    }
    res.status(200).json({ data: user });
  });

  // @desc    Create user
  // @route   POST  /api/v1/users
  // @access  Private/Admin
  createUser = asyncHandler(async (req, res, next) => {
    const newUser = await this.userService.createUser(req.body);
    res.status(201).json({ data: newUser });
  });

  createUserAndNext = asyncHandler(async (req, res, next) => {
    const newUser = await this.userService.createUser(req.body);
    res.status(201).json({ data: newUser });
    next();
  });

  updateUser = asyncHandler(async (req, res, next) => {
    const updatedUser = await this.userService.updateUser(req.params.id, {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    });

    if (!updatedUser) {
      return next(new ApiError(`No user for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: updatedUser });
  });

  deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedUser = await this.userService.deleteUser(id);

    if (!deletedUser) {
      return next(new ApiError(`No user for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    res.status(204).send();
  });

  // @desc    Get Logged user data
  // @route   GET /api/v1/users/getMe
  // @access  Private/Protect
  getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
  });

  // @desc    Update logged user password
  // @route   PUT /api/v1/users/updateMyPassword
  // @access  Private/Protect
  updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await this.userService.updateUser(req.user._id, {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    });
    // 2) Generate token
    const token = createToken(user._id);

    res.status(200).json({ data: user, token });
  });

  // @desc    Update logged user data (without password, role)
  // @route   PUT /api/v1/users/updateMe
  // @access  Private/Protect
  updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await this.userService.updateUser(req.user._id, {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    });
    if (!updatedUser) {
      return next(new ApiError(`No user for this id ${req.user._id}`, 404));
    }
    res.status(200).json({ data: updatedUser });
  });

  deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await this.UserService.updateUser(req.user._id, { active: false });

    res.status(204).json({ status: "Success" });
  });

  changeUserPassword = asyncHandler(async (req, res, next) => {
    const user = await this.userService.updateUser(req.params.id, {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    });

    if (!user) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: user });
  });
}

module.exports = UserController;
