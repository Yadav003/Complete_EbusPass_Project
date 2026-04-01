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

  return {
    routeId,
    source: source.trim(),
    destination: destination.trim(),
    distance: parsedDistance,
    fare: parsedFare,
  };
};