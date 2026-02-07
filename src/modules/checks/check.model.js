import mongoose from "mongoose";

const checkSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE"],
      default: "GET",
    },

    interval: {
      type: Number,
      required: true,
      // in seconds
    },

    timeout: {
      type: Number,
      default: 5000,
      // in ms
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    lastCheckedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const Check = mongoose.model("Check", checkSchema);
