import { Router } from "express";
import { CustomerService } from "../../services/customer.service";
import { CustomerController } from "../../controllers/customer.controller";
import { customerSchema, customerSchemaUpdate } from "../../validations/customer.validations";
import authenticate from "../../middlewares/authenticate";
import { Method } from "../../constants";
import { CustomerRepository } from "../../repositories/customer.repository";
import { validQueryParams } from "../../validations";

// api/v1/customers
const customerRoutes = Router();
const repository = new CustomerRepository();
const service = new CustomerService(repository);
const controller = new CustomerController(service);

customerRoutes.get("/", authenticate({
    key: "customers",
    method: Method.READ
}), validQueryParams, controller.getCustomers);

customerRoutes.post(
    "/",
    authenticate({ key: "customers", method: Method.CREATE }),
    customerSchema,
    controller.createCustomer
);
customerRoutes.route("/:id")
    .get(authenticate({ key: "customers", method: Method.READ }), controller.getCustomer)
    .patch(authenticate({ key: "customers", method: Method.UPDATE }),
        customerSchemaUpdate,
        controller.updateCustomer)
    .delete(
        authenticate({ key: "customers", method: Method.DELETE }),
        controller.deleteCustomer
    );


export default customerRoutes;
