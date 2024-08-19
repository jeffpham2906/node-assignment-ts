import { RequestHandler } from "express";
import { IAuthService } from "../interfaces/IAuthService";
import { logger } from "../lib/logger";
import { generateToken } from "../lib/jwt";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";

class AuthController {
    private service: IAuthService;
    constructor(service: IAuthService) {
        this.service = service;
    }
    login = catchAsync(async (req, res, next) => {
        logger.request(req, "Login User");
        const user = await this.service.onLogin(req.body);
        const token = generateToken(user);
        const data = { ...user, token };
        logger.response(req, res, user);
        res.status(200).json({
            message: "Login User",
            data,
        });
    });
    register = catchAsync(async (req, res, next) => {
        logger.request(req, "Register User");
        const response = await this.service.onRegister(req.body);
        logger.response(req, res, response);
        res.status(200).json({
            message: "Register User",
            response,
        });
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
