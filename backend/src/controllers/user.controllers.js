import { User } from "../modals/user.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, mobile, password } = req.body;

  // Validate required fields
  if (
    [fullname, email, mobile, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { mobile }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or mobile already exists");
  }

  // Create user (password hashed via pre-save hook)
  const user = await User.create({
    fullname: fullname.trim(),
    email: email.toLowerCase().trim(),
    mobile: mobile.trim(),
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

export { registerUser };