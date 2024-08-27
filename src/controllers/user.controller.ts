import catchAsync from "../utils/catchAsync";

import { StatusCodes } from "http-status-codes";
import { IUserService } from "../interfaces";
import { APIResponse } from "../utils/api.state";
import { STATUS_MESSAGES } from "../constants";

export class UserController {
    private service: IUserService;

    constructor(service: IUserService) {
        this.service = service;
    }

    getUsers = catchAsync(async (req, res) => {
        const data = await this.service.onGetUsers();
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
