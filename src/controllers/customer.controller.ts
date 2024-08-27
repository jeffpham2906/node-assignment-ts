import catchAsync from "../utils/catchAsync";

import { ICustomerService, QueryParams } from "../interfaces";
import { buildQueryParams, getRequiredConditions } from "../utils";
import { APIResponse } from "../utils/api.state";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";

export class CustomerController {
    private service: ICustomerService;

    constructor(service: ICustomerService) {
        this.service = service;
    }

    getCustomers = catchAsync(async (req, res) => {
        const { page, limit, sort, filter } = req.query as QueryParams;
        const conditions = getRequiredConditions(req);
        const data = await this.service.onGetCustomers(conditions, buildQueryParams(req.query));
        const total = data.length;
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, {
            items: data,
            total,
            page,
            limit,
            sort,
            filter
        }).send(res);
    });

    getCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onGetCustomer(parseInt(id), conditions);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    createCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const data = await this.service.onCreateCustomer(req.body, conditions);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    updateCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onUpdateCustomer(parseInt(id), req.body, conditions);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    deleteCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onDeleteCustomer(parseInt(id), conditions);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
