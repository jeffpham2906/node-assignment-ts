import mgLogger from "../services/logger.service";
import performanceTracker from "../services/performanceTracker.service";
import { RequestHandler } from "express";
import { logger } from "../lib/logger";

export const loggerMiddleware: RequestHandler = async (req, res, next) => {

    const start = Date.now();
    logger.request(req);
    const originalJson = res.json;
    res.json = function(body) {
        const responseTime = Date.now() - start;
        const safeData = JSON.parse(JSON.stringify(body));
        if (safeData?.data?.token) {
            safeData.data.token = undefined;
        }
        logger.response(req, res, { ...safeData });
        mgLogger.info((req as any).user, req, res, { ...safeData }).catch(error => next(error));
        performanceTracker.trackRequest({
            endpoint: req.originalUrl,
            method: req.method,
            responseTime,
            statusCode: res.statusCode
        }).catch(error => next(error));
        return originalJson.call(this, body);
    };
    next(null);
};