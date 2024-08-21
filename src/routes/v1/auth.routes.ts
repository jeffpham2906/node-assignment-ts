import { Router } from "express";
import { AuthService } from "../../services/auth.service";
import AuthController from "../../controllers/auth.controller";
import { loginSchema, registerSchema } from "../../validations/auth.validations";
import { UserRepository } from "../../repositories/user.repository";

// /api/v1/users
const authRoutes = Router();
const repository = new UserRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

authRoutes.post("/login", loginSchema, controller.login);

authRoutes.post("/register", registerSchema, controller.register);
authRoutes.post("/refresh-token", controller.refreshToken);

export default authRoutes;
