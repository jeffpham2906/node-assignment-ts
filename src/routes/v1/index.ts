import { Router } from "express";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";
import customerRoutes from "./customer.routes";
import roleRoutes from "./role.routes";
import authenticate from "../../middlewares/authenticate";
import { loggerMiddleware } from "../../middlewares/loggerMiddleware";
import officeRoute from "./office.routes";
import orderRoute from "./order.routes";
import productRoute from "./product.routes";
import logRoute from "./log.routes";

const apiRoutes = Router();

apiRoutes.use("/users", authRoutes);
// attach use data to req.user
apiRoutes.use(authenticate(), loggerMiddleware);
apiRoutes.use("/employees", employeeRoutes);
apiRoutes.use("/customers", customerRoutes);
apiRoutes.use("/roles", roleRoutes);
apiRoutes.use("/offices", officeRoute);
apiRoutes.use("/orders", orderRoute);
apiRoutes.use("/products", productRoute);
apiRoutes.use("/logs", logRoute);
// // /api/v1/report
// apiRoutes.get('/report', (req, res) => {

//  })
export default apiRoutes;
