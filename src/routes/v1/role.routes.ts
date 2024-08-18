import { Router } from "express";
import { RoleService } from "../../services/role.service";
import { RoleController } from "../../controllers/role.controller";
import { authenticate } from "../../lib/jwt";

// api/v1/roles
const roleRoutes = Router();
const roleService = new RoleService();
const roleController = new RoleController(roleService);

roleRoutes.get("/", authenticate({ key: "roles", method: "read" }), roleController.getRoles);

export default roleRoutes;
