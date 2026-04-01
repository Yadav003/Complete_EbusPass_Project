import { ApiError } from "../utils/ApiError.js";

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