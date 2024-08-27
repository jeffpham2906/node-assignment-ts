import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class APIResponse {
    statusCode: StatusCodes;
    message: string;
    data?: any;
    errors?: any;

    constructor(statusCode: StatusCodes, message: string, data?: any, errors?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.errors = errors;
        return this;
    }

    send = (res: Response) => {
        return res?.status(this.statusCode).json(this);
    };
}
