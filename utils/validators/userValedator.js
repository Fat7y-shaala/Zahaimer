const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");

const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
  check("partner_name")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalide email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email is already exist and in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password is too short")
    .custom((password, { req }) => {
      // eslint-disable-next-line eqeqeq
      if (password !== req.body.passwordConfirm) {
        throw new Error("password confirmation inccorect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("profileImg").optional(),
  check("role").optional(),

  check("age").isNumeric().withMessage("invalide age"),

  validatorMiddleware,
];

exports.getUserValidator = [
  // 1- rules
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalide email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email is already exist and in use"));
        }
      })
    ),
  check("profileImg").optional(),
  check("role").optional(),
  check("age").isNumeric().withMessage("invalid age"),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter the password confirm "),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      // verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("current password is incorrect");
      }

      // verify confirm password
      if (val !== req.body.passwordConfirm) {
        throw new Error("password confirmation inccorect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("partner_name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalide email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email is already exist and in use"));
        }
      })
    ),
  check("profileImg").optional(),
  check("age").isNumeric().withMessage("invalid age"),

  validatorMiddleware,
];