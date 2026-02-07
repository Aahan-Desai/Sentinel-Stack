import bcrypt from 'bcryptjs';
import { User } from './user.model.js';
import { signAccessToken } from '../../shared/utils/jwt.js';

/**
 * Register a new user (NO JWT here)
 */
export const registerUser = async ({
  tenantId,
  email,
  password,
  role = 'member'
}) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    tenantId,
    email,
    password: hashedPassword,
    role
  });

  return user;
};

/**
 * Login an existing user and issue JWT
 */
export const loginUser = async ({
  tenantId,
  email,
  password
}) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User
    .findOne({ tenantId, email })
    .select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = signAccessToken({
    userId: user._id,
    tenantId: user.tenantId,
    role: user.role
  });

  return {
    user,
    accessToken
  };
};
