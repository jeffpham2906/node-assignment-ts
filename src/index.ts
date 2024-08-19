import dotenv from "dotenv";
import e from "express";
import apiRoutes from "./routes/v1";
import { globalErrorHandler } from "./utils/error";
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
		app.use(e.urlencoded({ extended: true }));
		app.use((req, res, next) => {
			logger.request(req);
			next();
		});

		//Routes
		app.use("/api/v1", apiRoutes);

		app.use(globalErrorHandler);
		app.listen(port, () => {
			console.log(`Listening on port ${port} in ${environment} mode`);
		});
	} catch (error) {
		process.exit(1);
	}
};
bootstrap();
