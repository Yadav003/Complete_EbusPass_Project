import mongoose, { Schema } from "mongoose";

const routeSelectionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

export const RouteSelection = mongoose.model(
  "RouteSelection",
  routeSelectionSchema
);
