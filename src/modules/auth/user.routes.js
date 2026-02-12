import express from 'express';
import { listUsers, inviteUser, updateUser, changePassword, deleteAccount } from './user.controller.js';
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

router.put(
  '/profile',
  authMiddleware,
  updateUser
);

router.post(
  '/change-password',
  authMiddleware,
  changePassword
);

router.delete(
  '/account',
  authMiddleware,
  deleteAccount
);

export default router;
