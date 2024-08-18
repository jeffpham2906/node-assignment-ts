import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";
import customerRoutes from "./customer.routes";
import roleRoutes from "./role.routes";

const apiRoutes = Router();

apiRoutes.use("/users", authRoutes, userRoutes);
apiRoutes.use("/employees", employeeRoutes);
apiRoutes.use("/customers", customerRoutes);
apiRoutes.use("/roles", roleRoutes);

export default apiRoutes;
