import { Application } from "../../modals/application.modal.js";
import { asyncHandler } from "../../utils/asynhandler.js";
import { ApiError } from "../../utils/ApiError.js";

const getAllApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const applications = await Application.find(query)
    .populate("userId", "fullname email mobile")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Application.countDocuments(query);

  return res.status(200).json({
    message: "All applications retrieved successfully",
    applications,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const userId = req.user?._id;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  const application = await Application.findById(applicationId).populate(
    "userId",
    "fullname email mobile"
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.userId._id.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to view this application");
  }

  return res.status(200).json({
    message: "Application retrieved successfully",
    application,
  });
});

export { getAllApplications, getApplicationById };