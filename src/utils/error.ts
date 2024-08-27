import { isCelebrateError } from "celebrate";
import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "./api.state";
import { logger } from "../lib/logger";
import { STATUS_MESSAGES } from "../constants";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import mgLogger from "../services/logger.service";
import { JsonWebTokenError } from "jsonwebtoken";

export class BaseError extends Error {
    public readonly name: string;
    public readonly statusCode: StatusCodes;
    public readonly isOperational: boolean;

    constructor(name: string, statusCode: StatusCodes, message: string, isOperational: boolean) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class APIError extends BaseError {
    constructor(
        statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
        name: string = STATUS_MESSAGES.FAILED,
        message: string = STATUS_MESSAGES.SOME_THING_WENT_WRONG,
        isOperational: boolean = true
    ) {
        super(name, statusCode, message, isOperational);
    }
}

export const globalErrorHandler: ErrorRequestHandler = async (error, req, res, next) => {
    const user = (req as any)?.user || "Anonymous";
    let ERROR;
    let isValidateError = false;
    if (error instanceof JsonWebTokenError && !ERROR) {
        ERROR = new APIResponse(StatusCodes.UNAUTHORIZED, STATUS_MESSAGES.UNAUTHORIZED, null, error);
    }
    if (isCelebrateError(error) && !ERROR) {
        const { message, details } = error;
        const bodyDetails = details.get("body") || details.get("query");
        const errors = bodyDetails?.details.map((err) => {
            return { message: err.message, path: err.path };
        });
        isValidateError = true;
        ERROR = new APIResponse(StatusCodes.BAD_REQUEST, message, null, errors);
    }

    if (error instanceof APIError && !ERROR) {
        const { statusCode, message, name } = error;
        ERROR = new APIResponse(statusCode, name, null, message);
    }

    if (error instanceof PrismaClientKnownRequestError && !ERROR) {
        const { name, meta, code } = error;

        switch (code) {
            case "P2003":
                ERROR = new APIResponse(StatusCodes.BAD_REQUEST, name, null, `You are reference to an unknown ${meta?.field_name ?? "column"}`);
                break;
            case "P2002":
                ERROR = new APIResponse(StatusCodes.CONFLICT, name, null, `Unique constraint failed on the ${meta?.target ?? "column"}`);
                break;
            case "P2005":
            default:
                ERROR = new APIResponse(StatusCodes.BAD_REQUEST, name, null, { ...error });
                break;
        }
    }

    if (!ERROR) {
        ERROR = new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, STATUS_MESSAGES.SOME_THING_WENT_WRONG, null, { ...error });
    }

    if (isValidateError) {
        mgLogger.warning(user, req, res, ERROR).then(r => r);
    } else {
        mgLogger.error(user, req, res, ERROR).then(r => r);
    }
    logger.errorResponse(req, res, ERROR);
    return ERROR?.send(res) || res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: { ...error }
    });
};

