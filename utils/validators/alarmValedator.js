const { default: slugify } = require("slugify");

const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");

exports.getAlarmValidator = [
  // 1- rules
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.createAlarmValidator = [
  check("title")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 30 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("time")
    .notEmpty()
    .withMessage("required")
    .isTime()
    .withMessage("invalid time"),

  check("details")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 10 })
    .withMessage("too short")
    .isLength({ max: 150 })
    .withMessage("too long"),

  validatorMiddleware,
];

exports.updateAlarmValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  body("time").isTime(),

  body("details"),

  validatorMiddleware,
];

exports.deleteAlarmValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
