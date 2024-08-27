import { Router } from "express";
import catchAsync from "../../utils/catchAsync";
import performanceTracker from "../../services/performanceTracker.service";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../../utils/api.state";
import { STATUS_MESSAGES } from "../../constants";

const performanceRoutes = Router();

performanceRoutes.get("/", catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const filterObject = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
    };
    const logs = await performanceTracker.getPerformanceMetrics(filterObject);
    new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, {
        items: logs,
        ...filterObject
    }).send(res);
}));
performanceRoutes.delete("/", catchAsync(async (req, res) => {
    await performanceTracker.onDeleteAll();
    new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, undefined).send(res);
}));

export default performanceRoutes;