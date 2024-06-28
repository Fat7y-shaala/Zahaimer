const slugify = require("slugify");

const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");

exports.createPatientValidator = [
  check("mentalHealth")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 5 })
    .withMessage("too short")
    .isLength({ max: 150 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("yourAddress")
    .notEmpty()
    .withMessage("required")
    .isLength({ max: 100 })
    .withMessage("too long"),

  check("job")
    .notEmpty()
    .withMessage("required")
    .isLength({ max: 70 })
    .withMessage("too long"),

  check("phone").notEmpty().withMessage("required").isMobilePhone("ar-EG"),

  validatorMiddleware,
];

exports.getPatientValidator = [
  // 1- rules
  check("id").isMongoId().withMessage("invalid id format"),

  validatorMiddleware,
];

exports.updatePatientValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  body("mentalHealth")
    .notEmpty()
    .withMessage("required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  body("yourAddress").notEmpty().withMessage("required"),

  body("job").notEmpty().withMessage("required"),

  body("phone").notEmpty().withMessage("required"),

  validatorMiddleware,
];

exports.deletePatientValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
