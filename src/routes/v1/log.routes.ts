import mgLogger from "../../services/logger.service";
import catchAsync from "../../utils/catchAsync";

import { Router } from "express";
import { APIResponse } from "../../utils/api.state";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../../constants";
import { logQueryParams } from "../../validations";

const logRoute = Router();

// Sorry i'm lazy :v
logRoute.get("/",
    logQueryParams,
    catchAsync(async (req, res) => {
        const { level, user, startDate, endDate, data } = req.query;

        // Build the filter query
        const query: any = {
                ...(level && { level }),
                ...(user && { user }),
                ...(data && { data })
            }
        ;

        if (startDate || endDate) {
            query.createdAt = {
                $gte: startDate ? new Date(startDate as string).toISOString() : undefined,
                $lte: endDate ? new Date(endDate as string).toISOString() : undefined
            };
        }

        const logs = await mgLogger.onGetLogs(query);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, logs).send(res);
    }));

logRoute.patch("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedLog = await mgLogger.onUpdate(id, req.body);
    return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, updatedLog).send(res);
}));
logRoute.delete("/", catchAsync(async (req, res) => {
    await mgLogger.onDeleteAll();
    new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, undefined).send(res);
}));

export default logRoute;
