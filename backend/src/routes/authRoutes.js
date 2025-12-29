const express = require("express");
const authController = require("../controllers/authController");
const {
  validateSignup,
  validateLogin,
} = require("../middleware/validators/authValidators");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
