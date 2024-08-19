import { isCelebrateError } from "celebrate";
import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "./api.state";
import { logger } from "../lib/logger";

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
        name: string = "Failed",
        message: string = "Something went wrong",
        isOperational: boolean = true
    ) {
        super(name, statusCode, message, isOperational);
    }
}

export const globalErrorHandler: ErrorRequestHandler = async (error, req, res, next) => {
    if (isCelebrateError(error)) {
        const { message, details } = error;
        const bodyDetails = details.get("body");
        const errors = bodyDetails?.details.map((err) => {
            return { message: err.message, path: err.path };
        });
        const handledError = new APIResponse(StatusCodes.BAD_REQUEST, message, null, errors);
        handledError.send(res);
        return logger.errorResponse(req, res, handledError);
    }

    if (error instanceof APIError) {
        const { statusCode, message, name } = error;
        const handledError = new APIResponse(statusCode, name, null, { ...error, message });
        handledError.send(res);
        return logger.errorResponse(req, res, handledError);
    }
    const handledError = new APIResponse(StatusCodes.BAD_GATEWAY, "Something went wrong", null, error);
    handledError.send(res);
    return logger.errorResponse(req, res, handledError);
};
