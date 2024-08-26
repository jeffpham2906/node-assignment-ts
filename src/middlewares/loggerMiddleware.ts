import { NextFunction, Request, Response } from "express";
import mgLogger from "../services/logger.service";

export const loggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user || "Anonymous";
    await mgLogger.info(user, req, res, null);
    next();
};
