const express = require("express");
const UserController = require("../controllers/userController");
const AuthController = require("../controllers/authController");
const authController = new AuthController();
const userController = new UserController();
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers = userController.getUsers,
  getUser = userController.getUser,
  createUser = userController.createUser,
  updateUser = userController.updateUser,
  deleteUser = userController.deleteUser,
  uploadUserImage = userController.uploadUserImage,
  resizeImage = userController.resizeImage,
  changeUserPassword = userController.changeUserPassword,
  getLoggedUserData = userController.getLoggedUserData,
  updateLoggedUserPassword = userController.updateLoggedUserPassword,
  updateLoggedUserData = userController.updateLoggedUserData,
  deleteLoggedUserData = userController.deleteLoggedUserData,
} = require("../controllers/userController");

const router = express.Router();

router.use(authController.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
router.use(authController.allowedTo("admin", "manager"));
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
