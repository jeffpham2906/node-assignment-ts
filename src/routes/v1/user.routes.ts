import { Router } from "express";
import { UserService } from "../../services/user.service";
import { UserController } from "../../controllers/user.controller";

// api/v1/users
const userRoutes = Router();
const userService = new UserService();
const userController = new UserController(userService);

userRoutes.get("/", userController.getUsers);

export default userRoutes;
