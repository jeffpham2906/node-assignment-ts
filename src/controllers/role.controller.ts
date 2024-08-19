import { RequestHandler } from "express";
import { IRoleService } from "../interfaces/IRoleService";
import { logger } from "../lib/logger";

export class RoleController {
    private service: IRoleService;
    constructor(service: IRoleService) {
        this.service = service;
    }
    getRoles: RequestHandler = async (req, res) => {
        try {
            const data = await this.service.onGetRoles();
            res.status(200).json({
                message: "Get Roles",
                data,
            });
        } catch (error: any) {
            logger.errorResponse(req, res, error.message);
            res.status(400).json({ message: error.message, stack: error.stack });
        }
    };
}
