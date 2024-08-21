import { Router } from "express";
import { RoleService } from "../../services/role.service";
import { RoleController } from "../../controllers/role.controller";
import authenticate from "../../middlewares/authenticate";
import { Method } from "../../constants";

// api/v1/roles
const roleRoutes = Router();
const roleService = new RoleService();
const roleController = new RoleController(roleService);

roleRoutes.get("/", authenticate({ key: "roles", method: Method.READ }), roleController.getRoles);

export default roleRoutes;
