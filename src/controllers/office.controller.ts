import { StatusCodes } from "http-status-codes";
import { IOfficeService } from "../interfaces/office/IOfficeService";
import { logger } from "../lib/logger";
import mgLogger from "../services/logger.service";
import { APIResponse } from "../utils/api.state";
import catchAsync from "../utils/catchAsync";
import { STATUS_MESSAGES } from "../constants";

export class OfficeController {
    private service: IOfficeService;

    constructor(service: IOfficeService) {
        this.service = service;
    }

    getOffices = catchAsync(async (req, res) => {
        const data = await this.service.onGetOffices();
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
    getReport = catchAsync(async (req, res) => {
        const { officeCode } = req.params;
        const { startDate, endDate } = req.query;

        const data = await this.service.onGetReport(
            officeCode,
            new Date(startDate as string),
            new Date(endDate as string)
        );
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
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
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
    createOffice = catchAsync(async (req, res) => {
        const data = await this.service.onCreateOffice(req.body);
        logger.response(req, res, data);
        await mgLogger.info((req as any).user, req, res, { ...data });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
