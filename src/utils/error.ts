import { StatusCodes } from "http-status-codes";

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
        name: string,
        statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
        message: string = "Something went wrong",
        isOperational: boolean = true
    ) {
        super(name, statusCode, message, isOperational);
    }
}
