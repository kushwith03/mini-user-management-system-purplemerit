const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/users", authMiddleware, adminOnly, adminController.getAllUsers);

router.put(
  "/users/:userId/activate",
  authMiddleware,
  adminOnly,
  adminController.activateUser
);

router.put(
  "/users/:userId/deactivate",
  authMiddleware,
  adminOnly,
  adminController.deactivateUser
);

module.exports = router;
