import mongoose from "mongoose";
import { RouteSelection } from "../modals/routeSelection.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";

export const validateRouteSelection = (route) => {
  if (!route) {
    throw new ApiError(400, "Missing route details");
  }

  const { source, destination, distance, fare, routeId } = route;

  if (!source || !destination || distance === undefined || fare === undefined) {
    throw new ApiError(400, "All route details are required");
  }

  const parsedDistance = Number(distance);
  const parsedFare = Number(fare);

  if (Number.isNaN(parsedDistance) || Number.isNaN(parsedFare)) {
    throw new ApiError(400, "Route distance and fare must be valid numbers");
  }

  const normalizedRoute = {
    source: source.trim(),
    destination: destination.trim(),
    distance: parsedDistance,
    fare: parsedFare,
  };

  if (routeId && mongoose.Types.ObjectId.isValid(routeId)) {
    normalizedRoute.routeId = routeId;
  }

  return normalizedRoute;
};

const saveRouteSelection = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const routePayload = req.body.route ?? req.body;
  const normalizedRoute = validateRouteSelection(routePayload);

  const routeSelection = await RouteSelection.findOneAndUpdate(
    { userId },
    {
      userId,
      route: normalizedRoute,
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!routeSelection) {
    throw new ApiError(500, "Failed to save route selection");
  }

  return res.status(201).json({
    message: "Route selection saved successfully",
    routeSelection,
  });
});

export default saveRouteSelection;