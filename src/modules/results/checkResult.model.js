import mongoose from 'mongoose';

const checkResultSchema = new mongoose.Schema(
  {
    checkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Check',
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ['up', 'down'],
      required: true
    },

    responseTime: {
      type: Number,
      required: true
    },

    statusCode: {
      type: Number
    },

    error: {
      type: String,
      default: ''
    },

    checkedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: false }
);

export const CheckResult = mongoose.model(
  'CheckResult',
  checkResultSchema
);
