import mongoose from 'mongoose';

const  tenantSchema = new mongoose.Schema(
    {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export const Tenant = mongoose.model('Tenant', tenantSchema);