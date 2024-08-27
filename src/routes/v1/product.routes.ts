import { Router } from "express";
import { ProductRepository } from "../../repositories/product.repository";
import { ProductService } from "../../services/product.service";
import { ProductController } from "../../controllers/product.controller";
import { validQueryParams } from "../../validations";

const productRoute = Router();
const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);
productRoute.get("/", validQueryParams, controller.getProducts);

export default productRoute;
