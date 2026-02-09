import express from 'express';
import {
  createService,
  listServicesController,
  getServiceStatusHandler
} from './service.controller.js';

import { authMiddleware } from '../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../shared/middleware/rbac.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get("/", listServicesController);

router.post("/", requireRole("admin"), createService);

router.get("/:serviceId/status", getServiceStatusHandler);


export default router;
