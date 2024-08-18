import { StatusCodes } from "http-status-codes";

export class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: StatusCodes;
    public readonly isOperational: boolean;

    constructor(name: string, httpCode: StatusCodes, isOperational: boolean, message: string) {
        super(message);
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class APIError extends BaseError {
    constructor(
        name: string,
        httpCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
        isOperational: boolean = true,
        message: string = "Something went wrong"
    ) {
        super(name, httpCode, isOperational, message);
    }
}
