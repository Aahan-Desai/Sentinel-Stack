import express from 'express';
import {
  createService,
  listServicesController,
  getServiceStatusHandler,
  getServiceByIdController,
  getServiceHistoryHandler,
  updateServiceController,
  deleteServiceController,
  getGlobalStatsHandler
} from './service.controller.js';

import { authMiddleware } from '../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../shared/middleware/rbac.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get("/stats/global", getGlobalStatsHandler);
router.get("/", listServicesController);
router.get("/:serviceId", getServiceByIdController);
router.get("/:serviceId/history", getServiceHistoryHandler);
router.get("/:serviceId/status", getServiceStatusHandler);

router.post("/", requireRole("admin"), createService);
router.patch("/:serviceId", requireRole("admin"), updateServiceController);
router.delete("/:serviceId", requireRole("admin"), deleteServiceController);

export default router;
