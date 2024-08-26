import { Router } from "express";
import { employeeSchema, employeeSchemaUpdate } from "../../validations/employee.validations";
import authenticate from "../../middlewares/authenticate";
import { Method } from "../../constants";
import { EmployeeRepository } from "../../repositories/employee.repository";
import { EmployeeController } from "../../controllers/employee.controller";
import { EmployeeService } from "../../services/employee.service";

// api/v1/employees
const employeeRoutes = Router();
const repository = new EmployeeRepository();
const service = new EmployeeService(repository);
const controller = new EmployeeController(service);

employeeRoutes.get("/", authenticate({ key: "employees", method: Method.READ }), controller.getEmployees);
employeeRoutes.post(
    "/",
    authenticate({ key: "employees", method: Method.CREATE }),
    employeeSchema,
    controller.createEmployee
);
employeeRoutes
    .route("/:id")
    .get(authenticate({ key: "employees", method: Method.READ }), controller.getEmployee)
    .patch(
        authenticate({ key: "employees", method: Method.UPDATE }),
        employeeSchemaUpdate,
        controller.updateEmployee
    )
    .delete(authenticate({ key: "employees", method: Method.DELETE }), controller.deleteEmployee);


export default employeeRoutes;
