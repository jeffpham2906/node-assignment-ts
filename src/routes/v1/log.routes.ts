import { Router } from "express";
import mgLogger from "../../services/logger.service";
import performanceTracker from "../../services/performanceTracker.service";

const logRoute = Router();

logRoute.get("/", async (req, res) => {
    try {
        const { level, user, startDate, endDate, content } = req.query;

        // Build the filter query
        const query: any = {};

        if (level) {
            query.level = level;
        }

        if (user) {
            query.user = user;
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        } else if (startDate) {
            query.createdAt = {
                $gte: new Date(startDate as string),
            };
        } else if (endDate) {
            query.createdAt = {
                $lte: new Date(endDate as string),
            };
        }

        if (content) {
            query.$or = [
                { message: { $regex: content, $options: "i" } },
                { data: { $regex: content, $options: "i" } },
                { error: { $regex: content, $options: "i" } },
            ];
        }

        const logs = await mgLogger.onGetLogs(query);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching logs" });
    }
});

logRoute.get("/performances", async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const logs = await performanceTracker.getPerformanceMetrics({
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
        });
        res.status(200).json(logs);
    } catch (error: any) {
        res.status(500).json({ error: "An error occurred while fetching logs", stack: error.stack });
    }
});
export default logRoute;
