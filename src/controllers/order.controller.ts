import { StatusCodes } from "http-status-codes";
import { IOrderService } from "../interfaces/order/IOrderService";
import { logger } from "../lib/logger";
import mgLogger from "../services/logger.service";
import { APIResponse } from "../utils/api.state";
import catchAsync from "../utils/catchAsync";
import { STATUS_MESSAGES } from "../constants";

export class OrderController {
    private service: IOrderService;
    constructor(service: IOrderService) {
        this.service = service;
    }

    getOrders = catchAsync(async (req, res) => {
        const data = await this.service.onGetAll();
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
    createOrder = catchAsync(async (req, res) => {
        const data = await this.service.onCreate(req.body);
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
