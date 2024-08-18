import { Request, Response } from "express";
import winston from "winston";
const { combine, colorize, timestamp, align, printf } = winston.format;

class Logger {
    private logger: winston.Logger;
    constructor() {
        const prodTransport = new winston.transports.File({
            filename: "logs/combined.log",
            level: "info",
        });
        const devTransport = new winston.transports.Console({
            level: "info",
        });
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || "info",
            format: combine(
                colorize({ all: true }),
                timestamp({
                    format: "YYYY-MM-DD hh:mm:ss.SSS A",
                }),
                align(),
                printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
            transports: [process.env.NODE_ENV === "production" ? prodTransport : devTransport],
        });
    }
    request = (req: Request, message: string) => {
        this.logger.info(`Request: ${req.url} - ${req.method} - ${message}`);
    };

    response = (req: Request, res: Response, data: any) => {
        this.logger.info(`Response: ${req.url} - ${req.method} - ${res.statusCode} - ${JSON.stringify(data)}`);
    };

    errorResponse = (req: Request, res: Response, error: any) => {
        this.logger.error(`Error: ${req.url} - ${req.method} - ${res.statusCode} - ${JSON.stringify(error)}`);
    };

    error = (error: any) => {
        this.logger.error(error);
    };
}
export const logger = new Logger();
