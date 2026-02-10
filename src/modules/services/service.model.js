import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate URLs within the same tenant
serviceSchema.index({ tenantId: 1, url: 1 }, { unique: true });

export const Service = mongoose.model("Service", serviceSchema);
