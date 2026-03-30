import { Application } from "../modals/application.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../modals/user.modal.js";

// Create a new application
const createApplication = asyncHandler(async (req, res) => {
  const { personalDetails, documents, route, payment } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  // Validate required fields
  if (!personalDetails || !documents || !route || !payment) {
    throw new ApiError(400, "Missing required fields");
  }

  const {
    fullName,
    dob,
    gender,
    mobile,
    email,
    address,
    collegeName,
    course,
    yearSemester,
  } = personalDetails;

  if (
    !fullName ||
    !dob ||
    !gender ||
    !mobile ||
    !email ||
    !address ||
    !collegeName ||
    !course ||
    !yearSemester
  ) {
    throw new ApiError(400, "All personal details are required");
  }

  const { aadhaar, collegeId, photo } = documents;

  if (!aadhaar || !collegeId || !photo) {
    throw new ApiError(400, "All documents are required");
  }

  const { source, destination, distance, fare, routeId } = route;

  if (!source || !destination || !distance || !fare) {
    throw new ApiError(400, "All route details are required");
  }

  // Create application
  const application = await Application.create({
    userId,
    personalDetails: {
      fullName,
      dob: new Date(dob),
      gender,
      mobile,
      email: email.toLowerCase(),
      address,
      collegeName,
      course,
      yearSemester,
    },
    documents: {
      aadhaar,
      collegeId,
      photo,
    },
    route: {
      routeId,
      source,
      destination,
      distance,
      fare,
    },
    payment: {
      status: payment.status || "pending",
      amount: payment.amount,
      transactionId: payment.transactionId,
      method: payment.method,
      date: payment.date ? new Date(payment.date) : new Date(),
    },
    status: payment.status === "completed" ? "under_review" : "pending",
  });

  if (!application) {
    throw new ApiError(500, "Failed to create application");
  }

  return res.status(201).json({
    message: "Application created successfully",
    application,
  });
});

// Get all applications for a user
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

// Get application by ID
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

  // Check if user owns the application
  if (application.userId._id.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to view this application");
  }

  return res.status(200).json({
    message: "Application retrieved successfully",
    application,
  });
});

// Get all applications (admin only)
const getAllApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  let query = {};
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

// Update application status (admin only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, remarks } = req.body;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  if (!status || !["pending", "under_review", "approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Valid status is required");
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    {
      status,
      remarks: remarks || "",
      ...(status === "approved" && {
        passValidityStart: new Date(),
        passValidityEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }),
    },
    { new: true }
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res.status(200).json({
    message: "Application status updated successfully",
    application,
  });
});

// Update application (user can update pending or rejected applications)
const updateApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { personalDetails, documents, route } = req.body;
  const userId = req.user?._id;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Check if user owns the application
  if (application.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this application");
  }

  // Only allow updates if status is pending or rejected
  if (!["pending", "rejected"].includes(application.status)) {
    throw new ApiError(400, "Cannot update application with current status");
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    applicationId,
    {
      ...(personalDetails && { personalDetails }),
      ...(documents && { documents }),
      ...(route && { route }),
    },
    { new: true }
  );

  return res.status(200).json({
    message: "Application updated successfully",
    application: updatedApplication,
  });
});

// Delete application (user can delete only pending applications)
const deleteApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const userId = req.user?._id;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Check if user owns the application
  if (application.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this application");
  }

  // Only allow deletion if status is pending
  if (application.status !== "pending") {
    throw new ApiError(400, "Cannot delete application with current status");
  }

  await Application.findByIdAndDelete(applicationId);

  return res.status(200).json({
    message: "Application deleted successfully",
  });
});

export {
  createApplication,
  getUserApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
};
