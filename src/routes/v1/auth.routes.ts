import { Router } from "express";
import { AuthService } from "../../services/auth.service";
import AuthController from "../../controllers/auth.controller";
import { celebrate } from "celebrate";
import { loginSchema, registerSchema } from "../../validations/auth.validations";

const authRoutes = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

authRoutes.post("/login", celebrate({ body: loginSchema }), authController.login);
authRoutes.post("/register", celebrate({ body: registerSchema }), authController.register);
authRoutes.post("/refresh-token", authController.refreshToken);

export default authRoutes;
