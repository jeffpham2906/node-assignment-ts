import { User } from "@prisma/client";
import { IUserService } from "../interfaces/IUserService";
import { RequestHandler } from "express";

export class UserController {
    private service: IUserService;
    constructor(service: IUserService) {
        this.service = service;
    }
    getUsers: RequestHandler = async (req, res) => {
        const data = await this.service.onGetUsers();
        res.status(200).json({
            message: "Get Users",
            data,
        });
    };
}
