import { Order, OrderDetail } from "@prisma/client";
import { Joi } from "celebrate";
import { createBodySchema } from "../utils";

const orderDetail = Joi.object({
    productCode: Joi.string().required(),
    quantityOrdered: Joi.number().required().integer().default(1),
});

const orderSchema = Joi.object<Order & { orderDetails?: OrderDetail[] }>({
    customerNumber: Joi.number().required(),
    orderDate: Joi.date().default(new Date()),
    requiredDate: Joi.date().default(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
    shippedDate: Joi.date().default(null),
    status: Joi.string().valid("Pending", "In Process", "Shipped", "Cancelled").default("Pending"),
    comments: Joi.string().allow(null).optional(),
    orderDetails: Joi.array().items(orderDetail).required(),
});

export const createOrderSchema = createBodySchema(orderSchema);
