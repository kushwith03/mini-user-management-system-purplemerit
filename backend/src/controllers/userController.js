const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/password");

async function getCurrentUser(req, res) {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Get current user error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProfile(req, res) {
  const { fullName, email } = req.body;

  try {
    const updatedUser = await userModel.updateUserProfile(req.user.id, {
      fullName,
      email,
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await userModel.findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const newHash = await hashPassword(newPassword);
    await userModel.updateUserPassword(req.user.id, newHash);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getCurrentUser,
  updateProfile,
  changePassword,
};
