const express = require("express");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValedator");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

// Middleware to trim trailing spaces from URLs
router.use((req, res, next) => {
  req.url = req.url.replace(/%20/g, "");
  next();
});

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyPassResetCode").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);


module.exports = router;
