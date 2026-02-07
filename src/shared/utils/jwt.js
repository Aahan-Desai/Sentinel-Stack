import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

/**
 * ACCESS TOKEN
 */
export const signAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      tenantId: user.tenantId
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * REFRESH TOKEN
 */
export const signRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * VERIFY ACCESS TOKEN
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/**
 * VERIFY REFRESH TOKEN
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
