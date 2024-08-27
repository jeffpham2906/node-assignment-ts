import catchAsync from "../utils/catchAsync";

import { StatusCodes } from "http-status-codes";
import { IOrderService } from "../interfaces/order/IOrderService";
import { APIResponse } from "../utils/api.state";
import { STATUS_MESSAGES } from "../constants";
import { QueryParams } from "../interfaces";
import { buildQueryParams } from "../utils";

export class OrderController {
    private service: IOrderService;

    constructor(service: IOrderService) {
        this.service = service;
    }

    getOrders = catchAsync(async (req, res) => {
        const { page, limit, sort, filter } = req.query as QueryParams;
        const data = await this.service.onGetAll(buildQueryParams({ ...req.query }));
        const total = data.length;

        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, {
            items: data,
            total,
            page, limit, sort, filter
        }).send(res);
    });

    createOrder = catchAsync(async (req, res) => {
        const data = await this.service.onCreate(req.body);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
