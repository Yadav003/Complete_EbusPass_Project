import { registerUser } from "../controllers/user.controllers.js";
import { loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;