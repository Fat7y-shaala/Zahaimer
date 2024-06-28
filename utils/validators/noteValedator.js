const slugify = require("slugify");

const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");

exports.getNoteValidator = [
  // 1- rules
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];

exports.createNoteValidator = [
  check("title")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 5 })
    .withMessage("too short")
    .isLength({ max: 100 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("content")
    .notEmpty()
    .withMessage("required")
    .isLength({ min: 10 })
    .withMessage("too short")
    .isLength({ max: 150 }),

  validatorMiddleware,
];

exports.updateNoteValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteNoteValidator = [
  check("id").isMongoId().withMessage("invalid id format"),
  validatorMiddleware,
];
