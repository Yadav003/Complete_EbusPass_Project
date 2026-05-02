import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../modals/user.modal.js";
import { asyncHandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendEmail } from "../utils/email.js";


export const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const loginWithRole = (requiredRole) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new ApiError(403, "Admin access required");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
      .status(200)
      .cookie("accessToken", accessToken, COOKIE_OPTIONS)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .json({
        message: "Login successful",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  });

const loginUser = loginWithRole();
const loginAdmin = loginWithRole("admin");

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || String(email).trim() === "") {
    throw new ApiError(400, "Email is required");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(200).json({
      message: "If this email is registered, a password reset link has been sent.",
    });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordTokenHash = hashedToken;
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const clientBaseUrl =
    process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:8080";
  const resetUrl = `${clientBaseUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2 style="margin-bottom: 8px;">Reset your eBusPass password</h2>
      <p>We received a request to reset your password. This link is valid for 15 minutes.</p>
      <p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 16px; background: #111827; color: #fff; text-decoration: none; border-radius: 6px;">
          Reset Password
        </a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Reset your eBusPass password",
      html,
      text: `Reset your eBusPass password using this link (valid for 15 minutes): ${resetUrl}`,
    });
  } catch (error) {
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, error instanceof Error ? error.message : "Failed to send reset email");
  }

  return res.status(200).json({
    message: "If this email is registered, a password reset link has been sent.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password, confirmPassword } = req.body;

  if (!email || !token || !password || !confirmPassword) {
    throw new ApiError(400, "Email, token, password and confirm password are required");
  }

  if (String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const hashedToken = crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");

  const user = await User.findOne({
    email: normalizedEmail,
    resetPasswordTokenHash: hashedToken,
    resetPasswordExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = String(password);
  user.refreshToken = undefined;
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  return res.status(200).json({
    message: "Password reset successful. Please log in with your new password.",
  });
});

// Logout

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json({ message: "Logged out successfully" });
});

// Refresh Access Token 
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is invalid or has been used");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json({ accessToken, refreshToken });
});

export { loginUser, loginAdmin, logoutUser, refreshAccessToken, forgotPassword, resetPassword };
