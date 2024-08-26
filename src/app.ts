import dotenv from "dotenv";
const environment = process.env.NODE_ENV;
dotenv.config({
	path: `./environments/${environment}.env`,
});
import e from "express";
import apiRoutes from "./routes/v1";
import cors from "cors";
import swaggerDocs from "./docs/swagger";
import { globalErrorHandler } from "./utils/error";
import { logger } from "./lib/logger";

import performanceTracker from "./services/performanceTracker.service";

const bootstrap = async () => {
	process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
		throw reason;
	});

	try {
		const port = Number(process.env.PORT) || 3000;
		const app = e();
		console.log("Hello");
		//Middlewares
		app.use(e.json());
		app.use(e.urlencoded({ extended: true }));
		app.use(cors({ origin: "*" }));
		app.use(async (req, res, next) => {
			const start = Date.now();
			res.on("finish", async () => {
				const responseTime = Date.now() - start;
				await performanceTracker.trackRequest({
					endpoint: req.originalUrl,
					method: req.method,
					responseTime,
					statusCode: res.statusCode,
				});
			});
			next();
		});
		app.use((req, res, next) => {
			logger.request(req);
			next();
		});

		//Routes
		app.use(swaggerDocs);
		app.use("/api/v1", apiRoutes);

		app.use(globalErrorHandler);
		app.listen(port, () => {
			console.log(`Listening on port ${port} in ${environment} mode`);
		});
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
};
bootstrap();
