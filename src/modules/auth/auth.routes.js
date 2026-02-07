import express from 'express';

import {
  register,
  login,
  refreshToken,
  logout
} from './auth.controller.js';

import { authMiddleware } from '../../shared/middleware/auth.middleware.js';
import { authRateLimiter } from '../../shared/middleware/rateLimit.middleware.js';

const router = express.Router();

/**
 * Register a new user
 * Rate-limited to prevent abuse
 */
router.post(
  '/register',
  authRateLimiter,
  register
);

/**
 * Login user
 * Rate-limited to prevent brute-force attacks
 */
router.post(
  '/login',
  authRateLimiter,
  login
);

/**
 * Refresh access token
 * Uses refresh token (httpOnly cookie)
 */
router.post(
  '/refresh',
  refreshToken
);

/**
 * Logout user
 * Clears refresh token
 */
router.post(
  '/logout',
  authMiddleware,
  logout
);

export default router;
