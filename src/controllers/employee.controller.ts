import { RequestHandler } from "express";
import { IEmployeeService } from "../interfaces/IEmployeeService";

export class EmployeeController {
    private service: IEmployeeService;
    constructor(service: IEmployeeService) {
        this.service = service;
    }

    getEmployees: RequestHandler = async (req, res) => {
        const data = await this.service.onGetEmployees();
        res.status(200).json({
            message: "Get Employees",
            data,
        });
    };
    createEmployee: RequestHandler = async (req, res) => {
        const data = await this.service.onCreateEmployee(req.body);
        res.status(200).json({
            message: "CreateEmployee",
            data,
        });
    };
    updateEmployee: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await this.service.onUpdateEmployee(+id, req.body);
            res.status(200).json({
                message: "Update Employee",
                data,
            });
        } catch (error) { }
    };
}
