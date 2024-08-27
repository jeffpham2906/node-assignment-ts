import catchAsync from "../utils/catchAsync";

import { StatusCodes } from "http-status-codes";
import { IOfficeService } from "../interfaces/office/IOfficeService";

;
import { APIResponse } from "../utils/api.state";
import { STATUS_MESSAGES } from "../constants";
import { QueryParams } from "../interfaces";
import { buildQueryParams } from "../utils";

export class OfficeController {
    private service: IOfficeService;

    constructor(service: IOfficeService) {
        this.service = service;
    }

    getOffices = catchAsync(async (req, res) => {
        const { page, limit, sort, filter } = req.query as QueryParams;
        const data = await this.service.onGetOffices(buildQueryParams(req.query));
        const total = data.length;

        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, {
            items: data,
            total,
            page, limit, sort, filter
        }).send(res);
    });

    getReport = catchAsync(async (req, res) => {
        const { officeCode } = req.params;
        const { startDate, endDate } = req.query;

        const data = await this.service.onGetReport(
            officeCode,
            new Date(startDate as string),
            new Date(endDate as string)
        );
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    getReportRevenueCustomerByEmployee = catchAsync(async (req, res) => {
        const { employeeNumber } = req.params;
        const { startDate, endDate } = req.query;

        const data = await this.service.onGetReportRevenueCustomerByEmployee(
            parseInt(employeeNumber),
            new Date(startDate as string),
            new Date(endDate as string)
        );
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    createOffice = catchAsync(async (req, res) => {
        const data = await this.service.onCreateOffice(req.body);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    updateOffice = catchAsync(async (req, res) => {
        const { officeCode } = req.params;
        const data = await this.service.onUpdateOffice(officeCode, { ...req.body });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    deleteOffice = catchAsync(async (req, res) => {
        const { officeCode } = req.params;
        const data = await this.service.onDeleteOffice(officeCode);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
