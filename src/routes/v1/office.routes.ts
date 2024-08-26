import { Router } from "express";
import { OfficeRepository } from "../../repositories/office.repository";
import { OfficeService } from "../../services/office.service";
import { OfficeController } from "../../controllers/office.controller";
import { officeQuerySchema } from "../../validations/office.validations";

// /api/v1/offices
const officeRoute = Router();
const repository = new OfficeRepository();
const service = new OfficeService(repository);
const controller = new OfficeController(service);

officeRoute.get("/report", officeQuerySchema, controller.getReport);
officeRoute.get("/report/:officeCode", officeQuerySchema, controller.getReport);
officeRoute.get("/report/employees/:employeeNumber", officeQuerySchema, controller.getReportRevenueCustomerByEmployee);
export default officeRoute;
