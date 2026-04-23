import { Application } from "../../modals/application.modal.js";
import { BasicDetails } from "../../modals/basicDetails.modal.js";
import { DocumentsUpload } from "../../modals/documentsUpload.modal.js";
import { RouteSelection } from "../../modals/routeSelection.modal.js";
import { asyncHandler } from "../../utils/asynhandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { validateBasicDetails } from "../basicDetails.controller.js";
import { validateDocumentsUpload } from "../documentsUpload.controllers.js";
import { validateRouteSelection } from "../routeSelection.controllers.js";
import { validatePaymentDetails } from "../payments.controllers.js";

const ACTIVE_APPLICATION_STATUSES = ["pending", "pay_pending", "under_review", "approved"];

const getLatestActiveApplication = (userId) =>
  Application.findOne({ userId, status: { $in: ACTIVE_APPLICATION_STATUSES } }).sort({ createdAt: -1 });

const ensureUserCanCreateNewApplication = async (userId) => {
  const activeApplication = await getLatestActiveApplication(userId);

  if (activeApplication) {
    throw new ApiError(
      409,
      "You already have an active application. You can apply again only after your latest application is rejected"
    );
  }
};

const createApplication = asyncHandler(async (req, res) => {
  const { personalDetails, documents, route, payment } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  await ensureUserCanCreateNewApplication(userId);

  const normalizedPersonalDetails = validateBasicDetails(personalDetails);
  const normalizedDocuments = validateDocumentsUpload(documents);
  const normalizedRoute = validateRouteSelection(route);
  const normalizedPayment = validatePaymentDetails(payment);

  const application = await Application.create({
    userId,
    personalDetails: normalizedPersonalDetails,
    documents: normalizedDocuments,
    route: normalizedRoute,
    payment: normalizedPayment,
    status: normalizedPayment.status === "completed" ? "under_review" : "pay_pending",
  });

  if (!application) {
    throw new ApiError(500, "Failed to create application");
  }

  return res.status(201).json({
    message: "Application created successfully",
    application,
  });
});

const getUserDraftProgress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const [basicDetails, documentsUpload, routeSelection, activeApplication, latestApplication] =
    await Promise.all([
      BasicDetails.findOne({ userId }),
      DocumentsUpload.findOne({ userId }),
      RouteSelection.findOne({ userId }),
      getLatestActiveApplication(userId),
      Application.findOne({ userId }).sort({ createdAt: -1 }),
    ]);

  const completedSteps = {
    basicDetails: Boolean(basicDetails?.personalDetails),
    documents: Boolean(
      documentsUpload?.documents?.aadhaar?.url &&
        documentsUpload?.documents?.collegeId?.url &&
        documentsUpload?.documents?.photo?.url
    ),
    routeSelection: Boolean(routeSelection?.route),
    payment: Boolean(activeApplication?.payment?.status === "completed"),
  };

  const totalSteps = 4;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  let resumeStep = null;
  if (!completedSteps.basicDetails) {
    resumeStep = 1;
  } else if (!completedSteps.documents) {
    resumeStep = 2;
  } else if (!completedSteps.routeSelection) {
    resumeStep = 3;
  } else if (activeApplication?.status === "pay_pending") {
    resumeStep = 4;
  }

  return res.status(200).json({
    message: "Draft progress retrieved successfully",
    canCreateNewApplication: !activeApplication,
    hasActiveApplication: Boolean(activeApplication),
    activeApplication,
    latestApplication,
    progress: {
      completedSteps,
      completedCount,
      totalSteps,
      progressPercent,
      resumeStep,
    },
    draft: {
      basicDetails: basicDetails?.personalDetails ?? null,
      documents: {
        completed: completedSteps.documents,
        aadhaarUrl: documentsUpload?.documents?.aadhaar?.url ?? "",
        collegeIdUrl: documentsUpload?.documents?.collegeId?.url ?? "",
        photoUrl: documentsUpload?.documents?.photo?.url ?? "",
      },
      routeSelection: routeSelection?.route ?? null,
    },
  });
});

const updateApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { personalDetails, documents, route, payment } = req.body;
  const userId = req.user?._id;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this application");
  }

  if (!["pending", "pay_pending", "rejected"].includes(application.status)) {
    throw new ApiError(400, "Cannot update application with current status");
  }

  const normalizedPayment = payment ? validatePaymentDetails(payment) : undefined;

  const updatedApplication = await Application.findByIdAndUpdate(
    applicationId,
    {
      ...(personalDetails && { personalDetails }),
      ...(documents && { documents }),
      ...(route && { route }),
      ...(normalizedPayment && {
        payment: normalizedPayment,
        status: normalizedPayment.status === "completed" ? "under_review" : "pay_pending",
      }),
    },
    { new: true }
  );

  return res.status(200).json({
    message: "Application updated successfully",
    application: updatedApplication,
  });
});

const completeApplicationPayment = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const userId = req.user?._id;
  const paymentPayload = req.body.payment ?? req.body;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update payment for this application");
  }

  const normalizedPayment = validatePaymentDetails(paymentPayload);

  application.payment = normalizedPayment;
  application.status = normalizedPayment.status === "completed" ? "under_review" : "pay_pending";

  await application.save({ validateBeforeSave: false });

  return res.status(200).json({
    message: "Application payment updated successfully",
    application,
  });
});

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

  if (application.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this application");
  }

  if (application.status !== "pending") {
    throw new ApiError(400, "Cannot delete application with current status");
  }

  await Application.findByIdAndDelete(applicationId);

  return res.status(200).json({
    message: "Application deleted successfully",
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, remarks } = req.body;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  if (!status || !["pending", "pay_pending", "under_review", "approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Valid status is required");
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    {
      status,
      remarks: remarks || "",
      ...(status === "approved" && {
        passValidityStart: new Date(),
        passValidityEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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

export {
  createApplication,
  getUserDraftProgress,
  updateApplication,
  completeApplicationPayment,
  deleteApplication,
  updateApplicationStatus,
};