import { Router } from "express";
import {
  createApplication,
  getUserApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// User routes (protected)
router.route("/create").post(verifyJWT, createApplication);
router.route("/my-applications").get(verifyJWT, getUserApplications);
router.route("/:applicationId").get(verifyJWT, getApplicationById);
router.route("/:applicationId").put(verifyJWT, updateApplication);
router.route("/:applicationId").delete(verifyJWT, deleteApplication);

// Admin routes (protected - ideally add admin middleware)
router.route("/").get(verifyJWT, getAllApplications);
router.route("/:applicationId/status").put(verifyJWT, updateApplicationStatus);

export default router;
