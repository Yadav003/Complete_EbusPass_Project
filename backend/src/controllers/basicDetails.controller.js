import { BasicDetails } from "../modals/basicDetails.modal.js";
import { Application } from "../modals/application.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";

const ACTIVE_APPLICATION_STATUSES = ["pending", "pay_pending", "under_review", "approved"];

export const validateBasicDetails = (personalDetails) => {
  if (!personalDetails) {
    throw new ApiError(400, "Missing personal details");
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

  const parsedDob = new Date(dob);
  if (Number.isNaN(parsedDob.getTime())) {
    throw new ApiError(400, "Valid date of birth is required");
  }

  return {
    fullName: fullName.trim(),
    dob: parsedDob,
    gender,
    mobile: mobile.trim(),
    email: email.toLowerCase().trim(),
    address: address.trim(),
    collegeName: collegeName.trim(),
    course: course.trim(),
    yearSemester: yearSemester.trim(),
  };
};

const saveBasicDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const activeApplication = await Application.findOne({
    userId,
    status: { $in: ACTIVE_APPLICATION_STATUSES },
  });

  if (activeApplication) {
    throw new ApiError(
      409,
      "You already have an active application. You can apply again only after rejection"
    );
  }

  const personalDetailsPayload = req.body.personalDetails ?? req.body;
  const normalizedPersonalDetails = validateBasicDetails(personalDetailsPayload);

  const basicDetails = await BasicDetails.findOneAndUpdate(
    { userId },
    {
      userId,
      personalDetails: normalizedPersonalDetails,
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!basicDetails) {
    throw new ApiError(500, "Failed to save basic details");
  }

  return res.status(201).json({
    message: "Basic details saved successfully",
    basicDetails,
  });
});

export default saveBasicDetails;