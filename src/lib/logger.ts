import { Request, Response } from "express";
import winston from "winston";
const { combine, colorize, timestamp, align, printf } = winston.format;

class Logger {
    private logger: winston.Logger;
    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || "info",
            format: combine(
                colorize({ all: true }),
                timestamp({
                    format: "hh:mm:ss A DD-MM-YYYY",
                }),
                align(),
                printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
            transports: [
                new winston.transports.File({
                    filename: "logs/error.log",
                    level: "error",
                }),
                new winston.transports.File({ filename: "logs/combined.log" }),
                new winston.transports.Console(),
            ],
        });
    }
    request = (req: Request) => {
        this.logger.info(`Request: ${req.originalUrl} - ${req.method} `);
    };

    response = (req: Request, res: Response, data: any) => {
        this.logger.info(`Response: ${req.originalUrl} - ${req.method} - ${res.statusCode} - ${JSON.stringify(data)}`);
    };

    errorResponse = (req: Request, res: Response, error: any) => {
        this.logger.error(`Error: ${req.originalUrl} - ${req.method} - ${res.statusCode} - ${JSON.stringify(error)}`);
    };

    error = (error: any) => {
        this.logger.error(error);
    };

    info = (info: any) => {
        this.logger.info(info);
    };
}
export const logger = new Logger();
