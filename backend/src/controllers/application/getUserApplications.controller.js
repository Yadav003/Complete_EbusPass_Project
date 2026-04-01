import { Application } from "../../modals/application.modal.js";
import { asyncHandler } from "../../utils/asynhandler.js";
import { ApiError } from "../../utils/ApiError.js";

const getUserApplications = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const applications = await Application.find({ userId })
    .populate("userId", "fullname email mobile")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Applications retrieved successfully",
    applications,
  });
});

export default getUserApplications;