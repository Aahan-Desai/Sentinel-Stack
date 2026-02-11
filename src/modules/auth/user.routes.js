import express from 'express';
import { listUsers, inviteUser } from './user.controller.js';
import { authMiddleware } from '../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../shared/middleware/rbac.middleware.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  requireRole('admin'),
  listUsers
);

router.post(
  '/invite',
  authMiddleware,
  requireRole('admin'),
  inviteUser
);

export default router;
