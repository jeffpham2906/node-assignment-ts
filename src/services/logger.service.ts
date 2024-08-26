import { User } from "@prisma/client";
import mongoose from "mongoose";
import loggerRepository, { ILogger, LogLevel } from "../repositories/logger.repository";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";
import { Request, Response } from "express";
import { getMongoClient } from "../lib/mongoClient";

export class Logger {
    client: typeof loggerRepository | null = null;
    constructor() {
        this.connect();
    }

    private connect = async (mongoUri: string = process.env.MONGO_URL || "", dbName: string = "logger") => {
        try {
            await getMongoClient();
            this.client = loggerRepository;
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
        }
    };

    async log(entry: ILogger) {
        entry.user = entry.user || "Anonymous";
        if (!this.client) {
            throw new APIError(
                StatusCodes.BAD_GATEWAY,
                STATUS_MESSAGES.SOME_THING_WENT_WRONG,
                "MongoDB client not initialized"
            );
        }

        try {
            await this.client.create(entry);
        } catch (error) {
            console.error("Failed to insert log entry:", error);
        }
    }

    async error(user: User | string, req: Request, res: Response, error: any) {
        await this.log({
            level: LogLevel.Error,
            user,
            message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
            error,
        });
    }

    async warning(user: User | string, req: Request, res: Response, error: any) {
        await this.log({
            level: LogLevel.Warning,
            user,
            message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
            error,
        });
    }

    async info(user: User | string, req: Request, res: Response, data: any) {
        await this.log({
            level: LogLevel.Info,
            user,
            message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
            data,
        });
    }
    async onGetLogs(options: mongoose.QueryOptions) {
        return await this.client?.find(options);
    }
}

const mgLogger = new Logger();

export default mgLogger;
