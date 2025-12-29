const userModel = require("../models/userModel");

async function getAllUsers(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const users = await userModel.getAllUsers({ limit, offset });
    return res.status(200).json({
      page,
      limit,
      users,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function activateUser(req, res) {
  const { userId } = req.params;

  try {
    const user = await userModel.updateUserStatus(userId, "active");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Activate user error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deactivateUser(req, res) {
  const { userId } = req.params;

  try {
    const user = await userModel.updateUserStatus(userId, "inactive");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Deactivate user error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllUsers,
  activateUser,
  deactivateUser,
};
