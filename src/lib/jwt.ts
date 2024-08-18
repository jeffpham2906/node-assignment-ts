import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
const generateToken = (payload: any, expiresIn: string = "10m") => {
    return jwt.sign(payload, process.env.JWT_SECRET || "mySecret", {
        expiresIn,
    });
};

const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET || "mySecret");
};

type Method = "create" | "read" | "update" | "delete" | "full";
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
                const hasPermission = u_action.method === requiredPermissions.method || u_action.method === "full";
                if (u_action.conditions && hasPermission) {
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
            return res.status(401).json({ message: "You need to bearer token" });
        }
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }
        try {
            const payload = verifyToken(token) as any;
            if (requiredPermissions) {
                const userPermissions = payload.permissions as UserPermissions[];
                if (!userPermissions) {
                    return res.status(403).json({ message: "User does not have required permissions" });
                }
                const hasPermission = checkResource(userPermissions, requiredPermissions, req);
                if (!hasPermission) {
                    return res.status(403).json({ message: "User does not have required permissions" });
                }
            }
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};

export { generateToken, authenticate };
