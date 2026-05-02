import { getAllUsers, registerUser, updateUserRole } from "../controllers/user.controllers.js";
import { loginUser, loginAdmin, logoutUser, refreshAccessToken, forgotPassword, resetPassword } from "../controllers/auth.controllers.js";
import { Router } from "express";
import { requireAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/admin/login").post(loginAdmin);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/").get(verifyJWT, requireAdmin, getAllUsers);
router.route("/:id/role").patch(verifyJWT, requireAdmin, updateUserRole);

export default router;