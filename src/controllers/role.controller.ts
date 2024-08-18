import { RequestHandler } from "express";
import { IRoleService } from "../interfaces/IRoleService";

export class RoleController {
    private service: IRoleService;
    constructor(service: IRoleService) {
        this.service = service;
    }
    getRoles: RequestHandler = async (req, res) => {
        const data = await this.service.onGetRoles();
        res.status(200).json({
            message: "Get Roles",
            data,
        });
    };
}
