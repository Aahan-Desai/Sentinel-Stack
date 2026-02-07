import express from 'express';
import {
  createService,
  listServices
} from './service.controller.js';

import { authMiddleware } from '../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../shared/middleware/rbac.middleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  createService
);

router.get(
  '/:serviceId/status',
  authMiddleware,
  listServices
);

export default router;
