import mongoose, { Schema } from "mongoose";

const basicDetailsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      dob: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      mobile: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
      },
      collegeName: {
        type: String,
        required: true,
      },
      course: {
        type: String,
        required: true,
      },
      yearSemester: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const BasicDetails = mongoose.model("BasicDetails", basicDetailsSchema);