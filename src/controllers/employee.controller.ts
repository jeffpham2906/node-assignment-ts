import catchAsync from "../utils/catchAsync";

import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../utils/api.state";
import { STATUS_MESSAGES } from "../constants";
import { IEmployeeService, QueryParams } from "../interfaces";
import { buildQueryParams } from "../utils";

export class EmployeeController {
    private service: IEmployeeService;

    constructor(service: IEmployeeService) {
        this.service = service;
    }

    getEmployees = catchAsync(async (req, res) => {
        const { page, limit, sort, filter } = req.query as QueryParams;
        const data = await this.service.onGetEmployees(buildQueryParams(req.query));
        const total = data.length;

        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, {
            items: data,
            total,
            page, limit, sort, filter
        }).send(res);
    });

    getEmployee = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await this.service.onGetEmployee(parseInt(id));
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    createEmployee = catchAsync(async (req, res) => {
        const data = await this.service.onCreateEmployee(req.body);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    updateEmployee = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await this.service.onUpdateEmployee(parseInt(id), { ...req.body });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    deleteEmployee = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await this.service.onDeleteEmployee(parseInt(id));
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
