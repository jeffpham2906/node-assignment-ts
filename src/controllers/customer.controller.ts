import { Request, RequestHandler } from "express";
import { ICustomerService } from "../interfaces/ICustomerService";
import { Employee, User } from "@prisma/client";
import { getRequiredConditions } from "../utils";
import { logger } from "../lib/logger";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";

export class CustomerController {
    private service: ICustomerService;
    constructor(service: ICustomerService) {
        this.service = service;
    }
    getCustomers = catchAsync(async (req, res, next) => {
        logger.request(req, "getCustomers");
        const conditions = getRequiredConditions(req);
        const data = await this.service.onGetCustomers(conditions);
        logger.response(req, res, data);
        res.status(200).json({
            message: "Get Customers",
            data,
        });
    });
    getCustomer = catchAsync(async (req, res, next) => {
        logger.request(req, "getCustomer");
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onGetCustomer(parseInt(id), conditions);
        logger.response(req, res, data);
        res.status(200).json({
            message: "Get Customer",
            data,
        });
    });
    createCustomer = catchAsync(async (req, res, next) => {
        logger.request(req, "createCustomer");
        const conditions = getRequiredConditions(req);
        const data = await this.service.onCreateCustomer(req.body, conditions);
        logger.response(req, res, data);
        res.status(200).json({
            message: "Create Customer",
            data,
        });
    });
    updateCustomer = catchAsync(async (req, res, next) => {
        logger.request(req, "updateCustomer");
        const conditions = getRequiredConditions(req);

        const { id } = req.params;
        const data = await this.service.onUpdateCustomer(+id, req.body, conditions);
        logger.response(req, res, data);
        res.status(200).json({
            message: "Update Customer",
            data,
        });
    });
    deleteCustomer = catchAsync(async (req, res, next) => {
        logger.request(req, "deleteCustomer");
        const conditions = getRequiredConditions(req);
        const { id } = req.params;
        const data = await this.service.onDeleteCustomer(parseInt(id), conditions);
        logger.response(req, res, data);
        res.status(200).json({
            message: "Delete Customer",
            data,
        });
    });
}
