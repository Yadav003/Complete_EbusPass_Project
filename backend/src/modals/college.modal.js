import mongoose, { Schema } from "mongoose";

const collegeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

collegeSchema.index({ name: 1, district: 1 }, { unique: true });

export const College = mongoose.model("College", collegeSchema);
