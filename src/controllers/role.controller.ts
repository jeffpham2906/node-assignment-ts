import { IRoleService } from "../interfaces/IRoleService";
import { logger } from "../lib/logger";
import catchAsync from "../utils/catchAsync";
import { APIResponse } from "../utils/api.state";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";

export class RoleController {
    private service: IRoleService;
    constructor(service: IRoleService) {
        this.service = service;
    }
    getRoles = catchAsync(async (req, res) => {
        const data = await this.service.onGetRoles();
        logger.response(req, res, data);
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
