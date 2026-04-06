import { Router } from "express";
import { createCollege, deleteCollege, getColleges, updateCollege } from "../controllers/college.controller.js";
import { requireAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getColleges);
router.route("/").post(verifyJWT, requireAdmin, createCollege);
router.route("/:collegeId").put(verifyJWT, requireAdmin, updateCollege);
router.route("/:collegeId").delete(verifyJWT, requireAdmin, deleteCollege);

export default router;
