import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { tenantMiddleware } from "./shared/middleware/tenant.middleware.js";
import { authMiddleware } from "./shared/middleware/auth.middleware.js";
import { requireRole } from "./shared/middleware/rbac.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/auth/user.routes.js";
import serviceRoutes from "./modules/services/service.route.js";
import incidentRoutes from "./modules/incidents/incident.route.js";

import { errorHandler } from "./shared/middleware/error.middleware.js";

const app = express();

/**
 * CORS — must be FIRST
 */
app.use(
  cors({
    origin: /http:\/\/localhost:\d+$/,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

app.use(tenantMiddleware);

app.use("/users", userRoutes);
app.use("/services", serviceRoutes);
app.use("/incidents", incidentRoutes);

app.use(errorHandler);

export default app;
