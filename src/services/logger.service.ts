import { User } from "@prisma/client";
import mongoose from "mongoose";
import loggerRepository, { ILogger, LogLevel } from "../repositories/logger.repository";
import { Request, Response } from "express";
import { getMongoClient } from "../lib/mongoClient";
import { logger } from "../lib/logger";

export class Logger {
    client: mongoose.Model<ILogger> | null = null;

    constructor() {
        this.connect().then(() => logger.info("Connected to loggerRepository"));
    }

    private connect = async () => {
        try {
            await getMongoClient();
            this.client = loggerRepository;
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
        }
    };

    async log(entry: ILogger) {
        try {
            entry.user = entry.user || "Anonymous";
            await this.client?.create(entry);
        } catch (error) {
            console.error("Failed to insert log entry:", error);
        }
    }

    async error(user: User | string, req: Request, res: Response, error: any) {
        await this.log({
            level: LogLevel.Error,
            user,
            message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
            error
        });
    }

    async warning(user: User | string, req: Request, res: Response, error: any) {
        await this.log({
            level: LogLevel.Warning,
            user,
            message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
            error
        });
    }

    async info(user: User | string, req: Request, res: Response, data: any) {
        await this.log({
            level: LogLevel.Info,
            user,
            message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
            data
        });
    }

    async onGetLogs(options: mongoose.QueryOptions) {
        return await this.client?.find(options);
    }
}

const mgLogger = new Logger();

export default mgLogger;
