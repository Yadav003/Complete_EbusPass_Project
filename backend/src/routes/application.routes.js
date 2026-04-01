import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import saveBasicDetails from "../controllers/basicDetails.controller.js";
import getUserApplications from "../controllers/application/getUserApplications.controller.js";
import { getApplicationById, getAllApplications } from "../controllers/application/getAllApplications.controller.js";
import {
	createApplication,
	updateApplication,
	deleteApplication,
	updateApplicationStatus,
} from "../controllers/application/applicationhandling.controller.js";

const router = Router();

// User routes (protected)
router.route("/basic-details").post(verifyJWT, saveBasicDetails);
router.route("/create").post(verifyJWT, createApplication);
router.route("/my-applications").get(verifyJWT, getUserApplications);
router.route("/:applicationId").get(verifyJWT, getApplicationById);
router.route("/:applicationId").put(verifyJWT, updateApplication);
router.route("/:applicationId").delete(verifyJWT, deleteApplication);

// Admin routes (protected - ideally add admin middleware)
router.route("/").get(verifyJWT, getAllApplications);
router.route("/:applicationId/status").put(verifyJWT, updateApplicationStatus);

export default router;
