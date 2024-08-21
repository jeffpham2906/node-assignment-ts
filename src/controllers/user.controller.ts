import { StatusCodes } from "http-status-codes";
import { IUserService } from "../interfaces/user/IUserService";
import { APIResponse } from "../utils/api.state";
import catchAsync from "../utils/catchAsync";
import { STATUS_MESSAGES } from "../constants";
import { logger } from "../lib/logger";

export class UserController {
    private service: IUserService;
    constructor(service: IUserService) {
        this.service = service;
    }
    getUsers = catchAsync(async (req, res) => {
        const data = await this.service.onGetUsers();
        logger.response(req, res, data);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
