import mongoose, { Schema } from "mongoose";

const documentsUploadSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    documents: {
      aadhaar: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        format: {
          type: String,
        },
        originalFilename: {
          type: String,
        },
        bytes: {
          type: Number,
        },
      },
      collegeId: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        format: {
          type: String,
        },
        originalFilename: {
          type: String,
        },
        bytes: {
          type: Number,
        },
      },
      photo: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        format: {
          type: String,
        },
        originalFilename: {
          type: String,
        },
        bytes: {
          type: Number,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentsUpload = mongoose.model(
  "DocumentsUpload",
  documentsUploadSchema
);