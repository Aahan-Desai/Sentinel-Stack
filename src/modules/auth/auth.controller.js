import bcrypt from 'bcryptjs';
import { User } from '../auth/user.model.js';
import { Tenant } from '../tenants/tenant.model.js';
import { ApiError } from '../../shared/errors/ApiError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../../shared/utils/jwt.js';

/**
 * REGISTER
 */
export const register = async (req, res) => {
  const { email, password, role = 'member', tenantSlug } = req.body;

  if (!email || !password || !tenantSlug) {
    throw new ApiError(400, 'Email, password and tenantSlug are required');
  }

  // Resolve or create tenant
  let tenant = await Tenant.findOne({ slug: tenantSlug });

  if (!tenant) {
    tenant = await Tenant.create({
      name: tenantSlug,
      slug: tenantSlug
    });
  }

  // Prevent duplicate users inside same tenant
  const existingUser = await User.findOne({
    email,
    tenantId: tenant._id
  });

  if (existingUser) {
    throw new ApiError(409, 'User already exists in this tenant');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    tenantId: tenant._id
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false // set true in production (HTTPS)
    })
    .status(201)
    .json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: tenant._id
      }
    });
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');


  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false
    })
    .json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
};

/**
 * REFRESH TOKEN
 */
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Refresh token missing');
  }

  const payload = verifyRefreshToken(token);

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const newAccessToken = signAccessToken(user);

  res.json({ accessToken: newAccessToken });
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
  res.clearCookie('refreshToken').json({
    message: 'Logged out successfully'
  });
};
