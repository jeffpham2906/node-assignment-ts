import dotenv from "dotenv";
import e, { ErrorRequestHandler } from "express";
import apiRoutes from "./routes/v1";

import { errors } from "celebrate";
import { StatusCodes } from "http-status-codes";
import { APIError } from "./utils/error";
import { logger } from "./lib/logger";
dotenv.config();

const bootstrap = async () => {
	process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
		throw reason;
	});

	try {
		const port = process.env.PORT || 3000;
		const environment = process.env.NODE_ENV || "development";
		const app = e();

		//Middlewares
		app.use(e.json());

		//Routes
		app.use("/api/v1", apiRoutes);

		app.use(errors({ statusCode: 401 }));
		const globalErrorHandler: ErrorRequestHandler = async (error, req, res, next) => {
			logger.errorResponse(req, res, error.message);
			if (error instanceof APIError) {
				const { stack, statusCode, message } = error;
				return res.status(statusCode).json({ statusCode, message, stack });
			}
			return res.status(StatusCodes.BAD_GATEWAY).json({
				message: "Something went wrong",
				error: error.message,
				stack: error.stack,
				statusCode: StatusCodes.BAD_GATEWAY,
			});
		};
		app.use(globalErrorHandler);
		app.listen(port, () => {
			console.log(`Listening on port ${port} in ${environment} mode`);
		});
	} catch (error) {
		process.exit(1);
	}
};
bootstrap();
