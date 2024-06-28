const slugify = require("slugify");

const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");

exports.getPersonValidator = [
  // 1- rules
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.createPersonValidator = [
  check("fullName")
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

  check("job")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 5 })
    .withMessage("too short")
    .isLength({ max: 70 }),

  check("address")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 5 })
    .withMessage("too short")
    .isLength({ max: 70 }),

  check("relation")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 5 })
    .withMessage("too short")
    .isLength({ max: 100 }),

  check("phone").notEmpty().withMessage("required").isMobilePhone("ar-EG"),

  check("additionalInformation")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 10 })
    .withMessage("too short")
    .isLength({ max: 150 }),
  validatorMiddleware,
];

exports.updatePersonValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  body("fullName")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  body("job").notEmpty().withMessage("required"),
  body("adress").notEmpty().withMessage("required"),
  body("relation").notEmpty().withMessage("required"),
  body("phone").notEmpty().withMessage("required").isMobilePhone("ar-EG"),
  body("additionalInformation").optional(),

  validatorMiddleware,
];

exports.deletePersonValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
