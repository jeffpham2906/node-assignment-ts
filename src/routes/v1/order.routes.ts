import { Router } from "express";
import { createOrderSchema } from "../../validations/order.validations";
import { OrderService } from "../../services/order.service";
import { OrderRepository } from "../../repositories/order.repository";
import { OrderController } from "../../controllers/order.controller";

// /api/v1/orders
const orderRoute = Router();
const repository = new OrderRepository();
const service = new OrderService(repository);
const controller = new OrderController(service);

orderRoute.get("/", controller.getOrders);
orderRoute.post("/", createOrderSchema, controller.createOrder);

export default orderRoute;
