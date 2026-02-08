import express from "express";
import cookieParser from "cookie-parser";
import { tenantMiddleware } from "./shared/middleware/tenant.middleware.js";
import { authMiddleware } from "./shared/middleware/auth.middleware.js";
import { requireRole } from "./shared/middleware/rbac.middleware.js";
import userRoutes from "./modules/auth/user.routes.js";
import serviceRoutes from "./modules/services/service.route.js";
import { errorHandler } from './shared/middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(tenantMiddleware);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);

app.get("/admin/health", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({
    status: "admin ok",
    user: req.user,
  });
});

app.get("/protected-health", authMiddleware, (req, res) => {
  res.json({
    status: "ok",
    user: req.user,
  });
});

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    tenant: req.tenant,
  });
});

app.use(errorHandler);

export default app;
