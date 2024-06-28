const { default: slugify } = require("slugify");

const { check } = require("express-validator");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
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

  check("age").notEmpty().withMessage("age required"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalide email"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),

  validatorMiddleware,
];
