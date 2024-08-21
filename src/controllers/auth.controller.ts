import { IAuthService } from "../interfaces/IAuthService";
import { logger } from "../lib/logger";
import { generateToken } from "../lib/jwt";
import catchAsync from "../utils/catchAsync";
import { APIResponse } from "../utils/api.state";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";

class AuthController {
    private service: IAuthService;
    constructor(service: IAuthService) {
        this.service = service;
    }

    login = catchAsync(async (req, res) => {
        const data = await this.service.onLogin(req.body);
        const token = generateToken(data);
        const dataWithToken = { ...data, token };
        logger.response(req, res, data);
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, dataWithToken).send(res);
    });

    register = catchAsync(async (req, res) => {
        const data = await this.service.onRegister(req.body);
        logger.response(req, res, data);
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    refreshToken = catchAsync(async (req, res) => {
        const { refreshToken } = req.body;
        const response = await this.service.onRefreshToken(refreshToken);
        res.status(200).json({
            message: "Refresh Token",
            response,
        });
    });
}
export default AuthController;
