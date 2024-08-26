import { isCelebrateError } from "celebrate";
import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "./api.state";
import { logger } from "../lib/logger";
import { STATUS_MESSAGES } from "../constants";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import mgLogger from "../services/logger.service";

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
    const user = (req as any).user || "Anonymous";
    if (isCelebrateError(error)) {
        const { message, details } = error;
        const bodyDetails = details.get("body");
        const errors = bodyDetails?.details.map((err) => {
            return { message: err.message, path: err.path };
        });
        const handledError = new APIResponse(StatusCodes.BAD_REQUEST, message, null, errors);
        handledError.send(res);
        mgLogger.warning(user, req, res, handledError);
        return logger.errorResponse(req, res, handledError);
    }

    if (error instanceof APIError) {
        const { statusCode, message, name } = error;
        const handledError = new APIResponse(statusCode, name, null, message);
        handledError.send(res);
        mgLogger.error(user, req, res, handledError);
        return logger.errorResponse(req, res, handledError);
    }
    if (error instanceof PrismaClientKnownRequestError) {
        const { name, meta } = error;
        const handledError = new APIResponse(StatusCodes.BAD_REQUEST, name, null, meta);
        handledError.send(res);
        console.log(error);
        mgLogger.error(user, req, res, handledError);
        return logger.errorResponse(req, res, handledError);
    }
    const handledError = new APIResponse(StatusCodes.BAD_GATEWAY, STATUS_MESSAGES.SOME_THING_WENT_WRONG, null, {
        ...error,
        stack: error.stack,
    });
    handledError.send(res);
    mgLogger.error(user, req, res, handledError);
    return logger.errorResponse(req, res, handledError);
};
