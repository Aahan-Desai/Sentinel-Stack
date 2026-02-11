import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
        index: true,
    },
    tenantId: {
        type: String,
        required: true,
        index: true,
    },
    serviceName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active',
    },
    error: {
        type: String,
        required: true,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: {
        type: Date,
    }
}, {
    timestamps: true
});

export const Incident = mongoose.model('Incident', incidentSchema);
