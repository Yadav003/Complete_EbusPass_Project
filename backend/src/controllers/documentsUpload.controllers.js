import { DocumentsUpload } from "../modals/documentsUpload.modal.js";
import { Application } from "../modals/application.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const ACTIVE_APPLICATION_STATUSES = ["pending", "pay_pending", "under_review", "approved"];

export const validateDocumentsUpload = (documents) => {
  if (!documents) {
    throw new ApiError(400, "Missing documents");
  }

  const { aadhaar, collegeId, photo } = documents;

  if (!aadhaar || !collegeId || !photo) {
    throw new ApiError(400, "All documents are required");
  }

  return {
    aadhaar: String(aadhaar).trim(),
    collegeId: String(collegeId).trim(),
    photo: String(photo).trim(),
  };
};

const getUploadedFile = (files, fieldName) => {
  const file = files?.[fieldName]?.[0];

  if (!file) {
    throw new ApiError(400, `${fieldName} file is required`);
  }

  return file;
};

const saveDocumentsUpload = asyncHandler(async (req, res) => {
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

  const aadhaarFile = getUploadedFile(req.files, "aadhaar");
  const collegeIdFile = getUploadedFile(req.files, "collegeId");
  const photoFile = getUploadedFile(req.files, "photo");

  const aadhaarUpload = await uploadOnCloudinary(aadhaarFile.path);
  const collegeIdUpload = await uploadOnCloudinary(collegeIdFile.path);
  const photoUpload = await uploadOnCloudinary(photoFile.path);

  if (!aadhaarUpload || !collegeIdUpload || !photoUpload) {
    throw new ApiError(500, "Failed to upload documents");
  }

  const documentsUpload = await DocumentsUpload.findOneAndUpdate(
    { userId },
    {
      userId,
      documents: {
        aadhaar: {
          url: aadhaarUpload.secure_url,
          publicId: aadhaarUpload.public_id,
          format: aadhaarUpload.format,
          originalFilename: aadhaarUpload.original_filename,
          bytes: aadhaarUpload.bytes,
        },
        collegeId: {
          url: collegeIdUpload.secure_url,
          publicId: collegeIdUpload.public_id,
          format: collegeIdUpload.format,
          originalFilename: collegeIdUpload.original_filename,
          bytes: collegeIdUpload.bytes,
        },
        photo: {
          url: photoUpload.secure_url,
          publicId: photoUpload.public_id,
          format: photoUpload.format,
          originalFilename: photoUpload.original_filename,
          bytes: photoUpload.bytes,
        },
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!documentsUpload) {
    throw new ApiError(500, "Failed to save uploaded documents");
  }

  return res.status(201).json({
    message: "Documents uploaded successfully",
    documentsUpload,
  });
});

export default saveDocumentsUpload;