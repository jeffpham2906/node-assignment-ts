import catchAsync from "../utils/catchAsync";
import mgLogger from "../services/logger.service";

import { StatusCodes } from "http-status-codes";
import { logger } from "../lib/logger";
import { APIResponse } from "../utils/api.state";
import { STATUS_MESSAGES } from "../constants";
import { IEmployeeService } from "../interfaces";

export class EmployeeController {
    private service: IEmployeeService;
    constructor(service: IEmployeeService) {
        this.service = service;
    }

    getEmployees = catchAsync(async (req, res) => {
        const data = await this.service.onGetEmployees();
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    createEmployee = catchAsync(async (req, res) => {
        const data = await this.service.onCreateEmployee(req.body);
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    updateEmployee = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await this.service.onUpdateEmployee(parseInt(id), { ...req.body });
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    deleteEmployee = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await this.service.onDeleteEmployee(parseInt(id));
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
