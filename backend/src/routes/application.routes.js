import { Router } from "express";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import saveBasicDetails from "../controllers/basicDetails.controller.js";
import saveDocumentsUpload from "../controllers/documentsUpload.controllers.js";
import saveRouteSelection from "../controllers/routeSelection.controllers.js";
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
router.route("/documents-upload").post(
	verifyJWT,
	upload.fields([
		{ name: "aadhaar", maxCount: 1 },
		{ name: "collegeId", maxCount: 1 },
		{ name: "photo", maxCount: 1 },
	]),
	saveDocumentsUpload
);
router.route("/route-selection").post(verifyJWT, saveRouteSelection);
router.route("/create").post(verifyJWT, createApplication);
router.route("/my-applications").get(verifyJWT, getUserApplications);
router.route("/:applicationId").get(verifyJWT, getApplicationById);
router.route("/:applicationId").put(verifyJWT, updateApplication);
router.route("/:applicationId").delete(verifyJWT, deleteApplication);

// Admin routes (protected - ideally add admin middleware)
router.route("/").get(verifyJWT, requireAdmin, getAllApplications);
router.route("/:applicationId/status").put(verifyJWT, requireAdmin, updateApplicationStatus);

export default router;
