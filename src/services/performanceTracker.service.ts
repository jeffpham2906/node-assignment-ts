import { getMongoClient } from "../lib/mongoClient";
import performanceTrackerRepository from "../repositories/performanceTracker.repository";

interface PerformanceMetrics {
    endpoint: string;
    method: string;
    responseTime: number;
    statusCode: number;
    timestamp: Date;
}
export class PerformanceTracker {
    private metricsCollection = performanceTrackerRepository || null;
    constructor() {
        this.connect();
    }
    private async connect() {
        try {
            await getMongoClient();
            this.metricsCollection = performanceTrackerRepository;
        } catch (error) {
            console.error("Failed to connect to MongoDB for performance tracking:", error);
        }
    }
    async trackRequest(metrics: Omit<PerformanceMetrics, "timestamp">) {
        const performanceEntry: PerformanceMetrics = {
            ...metrics,
            timestamp: new Date(),
        };

        try {
            await this.metricsCollection.create(performanceEntry);
        } catch (error) {
            console.error("Failed to insert performance metrics:", error);
        }
    }
    async getPerformanceMetrics(options: { startDate?: Date; endDate?: Date; endpoint?: string }) {
        const query: any = {};
        if (options.startDate || options.endDate) {
            query.timestamp = {};
            if (options.startDate) query.timestamp.$gte = options.startDate.toISOString();
            if (options.endDate) query.timestamp.$lte = options.endDate.toISOString();
        }
        if (options.endpoint) query.endpoint = options.endpoint;

        return this.metricsCollection.find(query);
    }
}
const performanceTracker = new PerformanceTracker();
export default performanceTracker;
