import jwt from "jsonwebtoken";
import { User } from "../modals/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynhandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized – access token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Access token is invalid or has expired");
  }

  const user = await User.findById(decoded._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});
