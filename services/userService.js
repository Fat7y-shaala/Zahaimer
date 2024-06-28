const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const { uploadSingleImage } = require("../middleWares/uploadImageMiddleware");
const factory = require("./handlerFactor");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");

// upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(400, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);
    // save image to db
    req.body.profileImg = filename;
  }

  next();
});

//@desc   get list of users
//@route   get /api/v1/users
//@access  private
exports.getUsers = factory.getAll(User);

//@desc   get specific user by id
//@route   get /api/v1/users/id:
//@access  private
exports.getUser = factory.getOne(User);

//@desc   create user
//@route   post /api/v1/users
//@access  private
exports.createUser = factory.createOne(User);

//@desc   update specific user
//@route   put /api/v1/users/id:
//@access  private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      partner_name: req.body.partner_name,
      slug: req.body.slug,
      age: req.body.age,
      profileImg: req.body.profileImg,
      email: req.body.email,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`no document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`no document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

//@desc   delete specific user
//@route   delete /api/v1/users/id:
//@access  private
exports.deleteUser = factory.deleteOne(User);

//@desc   get logged user data
//@route   get /api/v1/users/getMe
//@access  private
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//@desc    update logged user password
//@route   put /api/v1/users/changeMyPassword
//@access  private/ protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //update user password based on (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  // generate token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

//@desc    update logged user data (without password , role)
//@route   put /api/v1/users/updateMe
//@access  private/ protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      partner_name: req.body.partner_name,
      email: req.body.email,
      age: req.body.age,
      profileImg: req.body.profileImg,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

//@desc    udelete logged user
//@route   put /api/v1/users/deleteMe
//@access  private/ protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "success" });
});
