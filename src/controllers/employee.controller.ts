import { RequestHandler } from "express";
import { IEmployeeService } from "../interfaces/IEmployeeService";
import { getRequiredConditions } from "../utils";
import { logger } from "../lib/logger";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/error";
import catchAsync from "../utils/catchAsync";

export class EmployeeController {
    private service: IEmployeeService;
    constructor(service: IEmployeeService) {
        this.service = service;
    }

    getEmployees = catchAsync(async (req, res, next) => {
        logger.request(req, "getEmployees");
        const data = await this.service.onGetEmployees();
        logger.response(req, res, data);
        res.status(200).json({
            message: "Get Employees",
            data,
        });
    });
    createEmployee = catchAsync(async (req, res, next) => {
        logger.request(req, "createEmployee");
        const data = await this.service.onCreateEmployee(req.body);
        logger.response(req, res, data);
        res.status(200).json({
            message: "CreateEmployee",
            data,
        });
    });
    updateEmployee = catchAsync(async (req, res, next) => {
        logger.request(req, "updateEmployee");
        const { id } = req.params;
        const data = await this.service.onUpdateEmployee(parseInt(id), { ...req.body });
        logger.response(req, res, data);
        res.status(200).json({
            message: "Update Employee",
            data,
        });
    });
    deleteEmployee = catchAsync(async (req, res, next) => {
        logger.request(req, "deleteEmployee");
        const { id } = req.params;
        const data = await this.service.onDeleteEmployee(parseInt(id));
        logger.response(req, res, data);
        res.status(200).json({
            message: "Delete Employee",
            data,
        });
    });
}
