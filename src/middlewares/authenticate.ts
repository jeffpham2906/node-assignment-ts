import { Request, RequestHandler } from "express";
import { verifyToken } from "../lib/jwt";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/error";
import { Method, STATUS_MESSAGES } from "../constants";

type UserPermissions = {
    key: string;
    actions: [{ method: Method; conditions?: string[] }];
};
type RequiredPermission = { key: string; method: Method };
const checkResource = (
    userPermissions: UserPermissions[],
    requiredPermissions: RequiredPermission,
    req: Request
): boolean => {
    return userPermissions.some((u_permission) => {
        if (u_permission.key === requiredPermissions.key) {
            return u_permission.actions.some((u_action) => {
                const hasPermission = u_action.method === requiredPermissions.method || u_action.method === Method.FULL;
                if (u_action.conditions?.length && hasPermission) {
                    req.query.conditions = u_action.conditions;
                }
                return hasPermission;
            });
        }
        return false;
    });
};
const authenticate = (requiredPermissions?: RequiredPermission): RequestHandler => {
    return (req, res, next) => {
        if (!req.headers["authorization"] || !req.headers["authorization"]?.startsWith("Bearer")) {
            next(new APIError(StatusCodes.UNAUTHORIZED, STATUS_MESSAGES.UNAUTHORIZED, "You need to bearer token"));
        }
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            next(new APIError(StatusCodes.UNAUTHORIZED, STATUS_MESSAGES.UNAUTHORIZED, "Please bearer your token"));
            return;
        }
        try {
            const payload = verifyToken(token) as any;
            (req as any).user = payload;
            if (requiredPermissions) {
                const userPermissions = payload.permissions as UserPermissions[];
                const errorDenied = new APIError(
                    StatusCodes.FORBIDDEN,
                    STATUS_MESSAGES.ACCESS_DENIED,
                    "User does not have required permissions"
                );
                if (!userPermissions) {
                    next(errorDenied);
                }
                const hasPermission = checkResource(userPermissions, requiredPermissions, req);
                if (!hasPermission) {
                    next(errorDenied);
                }
            }
            next();
        } catch (error: any) {
            next(
                new APIError(
                    StatusCodes.UNAUTHORIZED,
                    STATUS_MESSAGES.UNAUTHORIZED,
                    error.message || "Your token is not valid"
                )
            );
        }
    };
};
export default authenticate;
