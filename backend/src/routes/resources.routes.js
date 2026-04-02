import { Router } from "express";
import { getBusStands, getDistricts, getStates } from "../controllers/resources.controller.js";

const router = Router();

router.get("/locations/states", getStates);
router.get("/locations/districts", getDistricts);
router.get("/locations/bus-stands", getBusStands);

export default router;