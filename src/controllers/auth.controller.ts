import { RequestHandler } from "express";
import { IAuthService } from "../interfaces/IAuthService";
import { logger } from "../lib/logger";
import { generateToken } from "../lib/jwt";

class AuthController {
    #service: IAuthService;
    constructor(service: IAuthService) {
        this.#service = service;
    }
    login: RequestHandler = async (req, res) => {
        try {
            logger.request(req, "Login User");

            const user = await this.#service.onLogin(req.body);
            const token = generateToken(user);
            const data = { ...user, token };
            logger.response(req, res, user);
            res.status(200).json({
                message: "Login User",
                data,
            });
        } catch (error: any) {
            res.status(401).json({
                message: error.message,
            });
        }
    };
    register: RequestHandler = async (req, res) => {
        const response = await this.#service.onRegister(req.body);
        res.status(200).json({
            message: "Register User",
            response,
        });
    };
    refreshToken: RequestHandler = async (req, res) => {
        const { refreshToken } = req.body;
        const response = await this.#service.onRefreshToken(refreshToken);
        res.status(200).json({
            message: "Refresh Token",
            response,
        });
    };
}
export default AuthController;
