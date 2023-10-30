const express = require("express");

const AuthController = require("../controllers/authController");
const authController = new AuthController();

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup = authController.signup,
  login = authController.login,
  logout = authController.logout,
  forgotPassword = authController.forgotPassword,
  verifyPassResetCode = authController.verifyPassResetCode,
  resetPassword = authController.resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.put("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
