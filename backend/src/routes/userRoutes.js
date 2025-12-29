const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/me", authMiddleware, userController.getCurrentUser);
router.put("/me", authMiddleware, userController.updateProfile);
router.put("/me/password", authMiddleware, userController.changePassword);

module.exports = router;
