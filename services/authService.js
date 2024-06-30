const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const User = require("../models/userModel");


//@desc   signup
//@route   get /api/v1/auth/signup
//@access  public
exports.signup = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.create({
    partner_name: req.body.partner_name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
  });
  // generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

//@desc   login
//@route   get /api/v1/auth/login
//@access  public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

//@desc   make sure that user logged in
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not login , please login", 401));
  }

  // verify token (no change happen ,expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("this user is not exist ", 401));
  }

  // check if user change his password after token created
  if (currentUser.passwordChangeAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "user recently change his password ,please login again",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

//@desc   user permissions
// ["admin" , "manager" ]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });

//@desc   forgot password
//@route   post /api/v1/auth/forgotPassword
//@access  public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user for this email${req.body.email}`, 404)
    );
  }
  // if user is exist , generate encrypted reset random 5 digit and save it in db
  const resetCode = Math.floor(10000 + Math.random() * 90000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save encrypted reset code in db
  user.passwordResetCode = hashedResetCode;
  //add expiration time for password reset code (10 minutes)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  const message = `Hi ${user.partner_name},\n we received a request to reset the password on your EL_Zahaimer account,\n ${resetCode}\nenter this code to complete the reset.,\nthanks for helping us to keep your account secure`;
  // send reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "your Reset Password code (valid for 10 minutes) ",
      message: message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("there is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "success", message: "reset code sent to email" });
});

//@desc   verify password reset code
//@route   post /api/v1/auth/verifyPassResetCode
//@access  public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ApiError(
        `this reset code : ${req.body.resetCode} is invalid or expired`,
        404
      )
    );
  }
  if (user.passwordResetVerified) {
    return next(
      new ApiError(
        `this reset code : ${req.body.resetCode} is already verified`,
        404
      )
    );
  }

  // reset code is valid
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "success", message: "reset code verified" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user for this email ${req.body.email}`, 404)
    );
  }

  // check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new ApiError(`reset code is not verified`, 400));
  }

  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // if everything is ok , generate new token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
