const { body, validationResult } = require("express-validator");

function validateSignup(req, res, next) {
  const validations = [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),

    body("email").isEmail().withMessage("Valid email is required"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];

  Promise.all(validations.map((v) => v.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((e) => e.msg),
      });
    }
    next();
  });
}

function validateLogin(req, res, next) {
  const validations = [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),
  ];

  Promise.all(validations.map((v) => v.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((e) => e.msg),
      });
    }
    next();
  });
}

module.exports = {
  validateSignup,
  validateLogin,
};
