import { IAuthService } from "../interfaces/IAuthService";
import { logger } from "../lib/logger";
import { generateToken } from "../lib/jwt";
import catchAsync from "../utils/catchAsync";
import { APIResponse } from "../utils/api.state";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";
import mgLogger from "../services/logger.service";

class AuthController {
    private service: IAuthService;
    constructor(service: IAuthService) {
        this.service = service;
    }

    login = catchAsync(async (req, res) => {
        mgLogger.info("Anonymous", req, res, null);
        const data = await this.service.onLogin(req.body);
        const token = generateToken(data);
        const dataWithToken = { ...data, token };
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, dataWithToken).send(res);
    });

    register = catchAsync(async (req, res) => {
        mgLogger.info("Anonymous", req, res, null);
        const data = await this.service.onRegister(req.body);
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });

    refreshToken = catchAsync(async (req, res) => {
        mgLogger.info("Anonymous", req, res, null);
        const { refreshToken } = req.body;
        const data = await this.service.onRefreshToken(refreshToken);
        mgLogger.info((req as any).user, req, res, { ...data });
        res.status(200).json({
            message: "Refresh Token",
            data,
        });
    });
}
export default AuthController;
