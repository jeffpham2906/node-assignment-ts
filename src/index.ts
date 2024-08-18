import dotenv from "dotenv";
import e, { ErrorRequestHandler } from "express";
import apiRoutes from "./routes/v1";
import { errorController } from "./controllers/error.controller";
import { errors, isCelebrateError } from "celebrate";
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
		const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
			if (!errorController.isTrustedError(err)) {
				return next(err);
			}
			await errorController.handleError(err);
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
