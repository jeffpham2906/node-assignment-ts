import { RequestHandler } from "express";
import { ICustomerService } from "../interfaces/ICustomerService";

export class CustomerController {
    private service: ICustomerService;
    constructor(service: ICustomerService) {
        this.service = service;
    }
    getCustomers: RequestHandler = async (req, res) => {
        const conditions = req.query.conditions;
        const data = await this.service.onGetCustomers();
        res.status(200).json({
            message: "Get Customers",
            data,
        });
    };
    getCustomer: RequestHandler = async (req, res) => {
        const conditions = req.query.conditions;
        const { id } = req.params;
        const data = await this.service.onGetCustomer(+id);
        res.status(200).json({
            message: "Get Customer",
            data,
        });
    };
    createCustomer: RequestHandler = async (req, res) => {
        const conditions = req.query.conditions;
        const data = await this.service.onCreateCustomer(req.body);
        res.status(200).json({
            message: "Create Customer",
            data,
        });
    };
    updateCustomer: RequestHandler = async (req, res) => {
        const conditions = req.query.conditions;
        const { id } = req.params;
        const data = await this.service.onUpdateCustomer(+id, req.body);
        res.status(200).json({
            message: "Update Customer",
            data,
        });
    };
    deleteCustomer: RequestHandler = async (req, res) => {
        const conditions = req.query.conditions;
        const { id } = req.params;
        const data = await this.service.onDeleteCustomer(+id);
        res.status(200).json({
            message: "Delete Customer",
            data,
        });
    };
}
