import { IAuthService } from "../interfaces/IAuthService";
import { logger } from "../lib/logger";
import { generateToken } from "../lib/jwt";
import catchAsync from "../utils/catchAsync";
import { APIResponse } from "../utils/api.state";
import { StatusCodes } from "http-status-codes";

class AuthController {
    private service: IAuthService;
    constructor(service: IAuthService) {
        this.service = service;
    }
    login = catchAsync(async (req, res) => {
        const user = await this.service.onLogin(req.body);
        const token = generateToken(user);
        const data = { ...user, token };
        logger.response(req, res, user);
        new APIResponse(StatusCodes.OK, "Login Successfully", data).send(res);
    });
    register = catchAsync(async (req, res) => {
        const response = await this.service.onRegister(req.body);
        logger.response(req, res, response);
        new APIResponse(StatusCodes.OK, "Register Successfully", response).send(res);
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
