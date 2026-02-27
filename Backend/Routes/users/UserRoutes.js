const express = require("express");
const router = express.Router();
const UserController = require("../../Controllers/Users/UserControllers");
const authMiddleware = require("../../middlewares/auth.middleware");  // Placeholder for JWT/role check

// Public routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

// Protected route: Update own profile (using JWT - no ID needed in URL)
router.put("/profile", authMiddleware(['Patient', 'Doctor', 'Admin', 'Official']), UserController.updateOwnProfile);

// User management routes
router.get("/", authMiddleware(['Admin']), UserController.getAllUsers);
router.get("/:id", authMiddleware(['Patient', 'Doctor', 'Admin']), UserController.getById);
router.put("/:id", authMiddleware(['Patient', 'Doctor', 'Admin']), UserController.updateUser);
router.delete("/:id", authMiddleware(['Admin']), UserController.deleteUser);

module.exports = router;