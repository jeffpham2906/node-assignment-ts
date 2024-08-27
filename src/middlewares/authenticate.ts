import { Request, RequestHandler } from "express";
import { verifyToken } from "../lib/jwt";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/error";
import { Method, STATUS_MESSAGES } from "../constants";
import catchAsync from "../utils/catchAsync";

type UserPermissions = {
    key: string;
    actions: [{ method: Method; conditions?: string[] }];
};
type RequiredPermission = { key: string; method: Method };
const checkPermission = (
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
    return catchAsync(async (req, res, next) => {
            if (!req.headers["authorization"] || !req.headers["authorization"]?.startsWith("Bearer")) {
                return next(new APIError(StatusCodes.UNAUTHORIZED, STATUS_MESSAGES.UNAUTHORIZED, "You need to bearer token")
                );
            }
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return next(new APIError(StatusCodes.UNAUTHORIZED, STATUS_MESSAGES.UNAUTHORIZED, "Please bearer your token"));
            }
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
                    throw errorDenied;
                }
                const hasPermission = checkPermission(userPermissions, requiredPermissions, req);
                if (!hasPermission) {
                    throw errorDenied;
                }
            }
            next();
        }
    );
};
export default authenticate;
