import { College } from "../modals/college.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynhandler.js";

const normalizeString = (value) => String(value ?? "").trim();

const getColleges = asyncHandler(async (_req, res) => {
  const colleges = await College.find({}).sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Colleges fetched successfully",
    colleges,
  });
});

const createCollege = asyncHandler(async (req, res) => {
  const name = normalizeString(req.body?.name);
  const address = normalizeString(req.body?.address);
  const district = normalizeString(req.body?.district);

  if (!name || !address || !district) {
    throw new ApiError(400, "Name, address, and district are required");
  }

  const existingCollege = await College.findOne({
    name: new RegExp(`^${name}$`, "i"),
    district: new RegExp(`^${district}$`, "i"),
  });

  if (existingCollege) {
    throw new ApiError(409, "College already exists in this district");
  }

  const college = await College.create({
    name,
    address,
    district,
  });

  return res.status(201).json({
    message: "College created successfully",
    college,
  });
});

const updateCollege = asyncHandler(async (req, res) => {
  const { collegeId } = req.params;

  if (!collegeId) {
    throw new ApiError(400, "College ID is required");
  }

  const college = await College.findById(collegeId);

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const incomingName = req.body?.name;
  const incomingAddress = req.body?.address;
  const incomingDistrict = req.body?.district;

  const hasAnyField =
    incomingName !== undefined ||
    incomingAddress !== undefined ||
    incomingDistrict !== undefined;

  if (!hasAnyField) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const nextName = incomingName !== undefined ? normalizeString(incomingName) : college.name;
  const nextAddress = incomingAddress !== undefined ? normalizeString(incomingAddress) : college.address;
  const nextDistrict = incomingDistrict !== undefined ? normalizeString(incomingDistrict) : college.district;

  if (!nextName || !nextAddress || !nextDistrict) {
    throw new ApiError(400, "Name, address, and district cannot be empty");
  }

  const duplicateCollege = await College.findOne({
    _id: { $ne: collegeId },
    name: new RegExp(`^${nextName}$`, "i"),
    district: new RegExp(`^${nextDistrict}$`, "i"),
  });

  if (duplicateCollege) {
    throw new ApiError(409, "Another college already exists in this district");
  }

  college.name = nextName;
  college.address = nextAddress;
  college.district = nextDistrict;

  await college.save();

  return res.status(200).json({
    message: "College updated successfully",
    college,
  });
});

const deleteCollege = asyncHandler(async (req, res) => {
  const { collegeId } = req.params;

  if (!collegeId) {
    throw new ApiError(400, "College ID is required");
  }

  const deletedCollege = await College.findByIdAndDelete(collegeId);

  if (!deletedCollege) {
    throw new ApiError(404, "College not found");
  }

  return res.status(200).json({
    message: "College deleted successfully",
  });
});

export { getColleges, createCollege, updateCollege, deleteCollege };
