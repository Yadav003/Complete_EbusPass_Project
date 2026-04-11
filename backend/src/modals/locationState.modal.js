import mongoose, { Schema } from "mongoose";

const locationStateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["STATE", "UNION_TERRITORY"],
      required: true,
    },
    districts: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

locationStateSchema.index({ name: 1 }, { unique: true });

export const LocationState = mongoose.model("LocationState", locationStateSchema);