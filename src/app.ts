import dotenv from "dotenv";

const environment = process.env.NODE_ENV;
dotenv.config({
    path: `./environments/${environment}.env`
});
import e from "express";
import apiRoutes from "./routes/v1";
import cors from "cors";
import swaggerDocs from "./docs/swagger";

import { globalErrorHandler } from "./utils/error";
import { loggerMiddleware } from "./middlewares/logger";
import { logger } from "./lib/logger";
import { errors } from "celebrate";

const port = Number(process.env.PORT) || 3000;
const bootstrap = async () => {
    process.on("unhandledRejection", (reason: Error) => {
        console.log("!213");
        throw reason;
    });

    try {

        const app = e();

        //Middlewares
        app.use(e.json());
        app.use(e.urlencoded({ extended: true }));
        app.use(cors({ origin: "*" }));
        app.use(loggerMiddleware);

        //Routes
        app.use(swaggerDocs);
        app.use("/api/v1", apiRoutes);

        // app.use(errors());
        app.use("*", (req, res) => {
            res.status(404).json({
                status: 404,
                message: "Page Not Found"
            });
        });
        //Handle Error

        app.use(globalErrorHandler);
        return app;
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};
bootstrap().then(app => app.listen(port, () => {
    console.log(`Listening on port ${port} in ${environment} mode`);
}));
