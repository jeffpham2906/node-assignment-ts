import { logger } from "../lib/logger";
import { BaseError } from "../utils/error";

export class ErrorHandler {
    /**
     *
     * @description This function will called when unhandled error is thrown or untrusted error is thrown
     */
    public async handleError(err: Error) {
        logger.error({ message: err.message, stack: err.stack });
        // Sending notifications
    }

    public isTrustedError(error: Error): boolean {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        // Implement error trust logic here
        return false;
    }
}
export const errorController = new ErrorHandler();
