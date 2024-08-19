import { Router } from "express";
import { authenticate } from "../../lib/jwt";
import { CustomerService } from "../../services/customer.service";
import { CustomerController } from "../../controllers/customer.controller";
import { celebrate } from "celebrate";
import { customerSchema, customerSchemaUpdate } from "../../validations/customer.validations";

// api/v1/customers
const customerRoutes = Router();
const customerService = new CustomerService();
const customerController = new CustomerController(customerService);

customerRoutes.get("/", authenticate({ key: "customers", method: "read" }), customerController.getCustomers);
customerRoutes.post(
    "/",
    authenticate({ key: "customers", method: "create" }),
    celebrate({
        body: customerSchema,
    }),
    customerController.createCustomer
);
customerRoutes.put(
    "/:id",
    authenticate({ key: "customers", method: "update" }),
    celebrate({ body: customerSchemaUpdate }),
    customerController.updateCustomer
);
customerRoutes.delete("/:id", authenticate({ key: "customers", method: "delete" }), customerController.deleteCustomer);

export default customerRoutes;
