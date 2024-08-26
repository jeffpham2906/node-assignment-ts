import mgLogger from "../services/logger.service";
import catchAsync from "../utils/catchAsync";

import { ICustomerService } from "../interfaces/customer/ICustomerService";
import { getRequiredConditions } from "../utils";
import { logger } from "../lib/logger";
import { APIResponse } from "../utils/api.state";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";

export class CustomerController {
    private service: ICustomerService;

    constructor(service: ICustomerService) {
        this.service = service;
    }

    getCustomers = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const data = await this.service.onGetCustomers(conditions);
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    getCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onGetCustomer(parseInt(id), conditions);
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    createCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const data = await this.service.onCreateCustomer(req.body, conditions);
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    updateCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onUpdateCustomer(parseInt(id), req.body, conditions);
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    deleteCustomer = catchAsync(async (req, res) => {
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onDeleteCustomer(parseInt(id), conditions);
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
