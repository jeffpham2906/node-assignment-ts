import { User } from "@prisma/client";
import { IUserService } from "../interfaces/IUserService";
import { RequestHandler } from "express";
import { logger } from "../lib/logger";

export class UserController {
    private service: IUserService;
    constructor(service: IUserService) {
        this.service = service;
    }
    getUsers: RequestHandler = async (req, res) => {
        try {
            const data = await this.service.onGetUsers();
            res.status(200).json({
                message: "Get Users",
                data,
            });
        } catch (error: any) {
            logger.errorResponse(req, res, error.message);
            res.status(400).json({ message: error.message, stack: error.stack });
        }
    };
}
