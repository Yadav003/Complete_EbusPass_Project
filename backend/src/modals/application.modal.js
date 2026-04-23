import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "pay_pending", "under_review", "approved", "rejected"],
      default: "pending",
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
    documents: {
      aadhaar: {
        type: String,
        required: true,
      },
      collegeId: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },
    route: {
      routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
      },
      source: {
        type: String,
        required: true,
      },
      destination: {
        type: String,
        required: true,
      },
      distance: {
        type: Number,
        required: true,
      },
      fare: {
        type: Number,
        required: true,
      },
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      amount: {
        type: Number,
        required: true,
      },
      transactionId: {
        type: String,
        unique: true,
      },
      method: {
        type: String,
        enum: ["UPI", "Debit Card", "Credit Card", "Net Banking"],
      },
      date: {
        type: Date,
      },
    },
    passValidityStart: {
      type: Date,
    },
    passValidityEnd: {
      type: Date,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);
