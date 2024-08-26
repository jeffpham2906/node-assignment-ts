import mongoose, { Schema } from "mongoose";

export interface PerformanceMetrics {
    endpoint: string;
    method: string;
    responseTime: number;
    statusCode: number;
    timestamp: Date;
}

const performanceTrackerSchema = new Schema<PerformanceMetrics>({
    endpoint: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    responseTime: {
        type: Number,
        required: true,
    },
    statusCode: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const performanceTrackerRepository = mongoose.model<PerformanceMetrics>("PerformanceTracker", performanceTrackerSchema);
export default performanceTrackerRepository;
