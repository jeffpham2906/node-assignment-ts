import { Router } from "express";
import { EmployeeService } from "../../services/employee.service";
import { EmployeeController } from "../../controllers/employee.controller";
import { authenticate } from "../../lib/jwt";
import { celebrate } from "celebrate";
import { employeeSchema, employeeSchemaUpdate } from "../../validations/employee.validations";

// api/v1/employees
const employeeRoutes = Router();
const employeeService = new EmployeeService();
const employeeController = new EmployeeController(employeeService);

employeeRoutes.get(
    "/",
    authenticate({ key: "employees", method: "read" }),
    celebrate({ body: employeeSchema }),
    employeeController.getEmployees
);
employeeRoutes.post(
    "/",
    authenticate({ key: "employees", method: "create" }),
    celebrate({ body: employeeSchema }),
    employeeController.createEmployee
);
employeeRoutes.put(
    "/:id",
    authenticate({ key: "employees", method: "update" }),
    celebrate({
        body: employeeSchemaUpdate,
    }),
    employeeController.updateEmployee
);

export default employeeRoutes;
