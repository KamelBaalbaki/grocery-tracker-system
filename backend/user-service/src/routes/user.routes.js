const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");


// Get current logged-in user
router.get("/me", protect, userController.getMe);

// Get user by ID (protected)
router.get("/:id", protect, userController.getUserById);

// Update user
router.put("/:id", protect, userController.updateUser);

// Delete user
router.delete("/:id", protect, userController.deleteUser);

// Logout current user
router.post("/logout", protect, userController.logout);

module.exports = router;
