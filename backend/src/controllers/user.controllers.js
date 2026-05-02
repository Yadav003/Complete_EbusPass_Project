import { User } from "../modals/user.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, mobile, password } = req.body;

  // Validate required fields
  if (
    [fullname, email, mobile, password].some(
      (field) => field === undefined || field === null || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const normalizedMobile = String(mobile).trim();

  if (!/^\d{10}$/.test(normalizedMobile)) {
    throw new ApiError(400, "Mobile number must be exactly 10 digits");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { mobile: normalizedMobile }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or mobile already exists");
  }

  // Create user (password hashed via pre-save hook)
  const user = await User.create({
    fullname: fullname.trim(),
    email: email.toLowerCase().trim(),
    mobile: normalizedMobile,
    role: "student",
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Failed to register user");
  }

  return res.status(201).json({
    message: "User registered successfully",
    user: createdUser,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("-password -refreshToken")
    .sort({ createdAt: -1 })
    .lean();

  const totalUsers = users.length;
  const totalAdmins = users.filter((user) => user.role === "admin").length;
  const totalStudents = users.filter((user) => user.role === "student").length;

  return res.status(200).json({
    users,
    summary: {
      totalUsers,
      totalAdmins,
      totalStudents,
    },
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id) {
    throw new ApiError(400, "User id is required");
  }

  if (!["student", "admin"].includes(role)) {
    throw new ApiError(400, "Role must be either 'student' or 'admin'");
  }

  if (String(req.user?._id) === String(id)) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role = role;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    message: "User role updated successfully",
    user,
  });
});

export { registerUser, getAllUsers, updateUserRole };