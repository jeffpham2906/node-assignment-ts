import mongoose, { Schema } from "mongoose";
export enum LogLevel {
    Error = "Error",
    Warning = "Warning",
    Info = "Info",
}
export interface ILogger {
    level: LogLevel;
    user: any;
    message: any;
    data?: any;
    error?: any;
    createdAt?: Date;
}
export const loggerSchema = new Schema<ILogger>({
    level: {
        type: String,
        enum: Object.values(LogLevel),
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
    },
    error: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const loggerRepository = mongoose.model("Log", loggerSchema);
export default loggerRepository;
