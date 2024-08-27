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
        entry.user = entry.user || "Anonymous";
        await this.client?.create({ ...entry });
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
        return this.log({
            level: LogLevel.Info,
            user,
            message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
            data
        });
    }

    async onGetLogs(options: mongoose.QueryOptions<typeof loggerRepository>) {
        return this.client?.find(options);
    }

    async onDeleteAll() {
        return this.client?.deleteMany();
    }

    async onUpdate(id: string, data: Partial<ILogger>) {
        return this.client?.updateOne({ id }, data);
    }
}

const mgLogger = new Logger();

export default mgLogger;
