import { LocationState } from "../modals/locationState.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getStates = asyncHandler(async (req, res) => {
  const states = await LocationState.find({}).sort({ name: 1 }).select("name -_id");

  return res.status(200).json({
    states: states.map((state) => state.name),
  });
});

export const getDistricts = asyncHandler(async (req, res) => {
  const stateName = String(req.query.state ?? "").trim();

  if (!stateName) {
    return res.status(200).json({ districts: [] });
  }

  const dbState = await LocationState.findOne({
    name: new RegExp(`^${escapeRegExp(stateName)}$`, "i"),
  }).select("districts -_id");

  return res.status(200).json({
    districts: dbState?.districts ?? [],
  });
});

export const getBusStands = (req, res) => {
  return res.status(200).json({
    busStands: [],
  });
};