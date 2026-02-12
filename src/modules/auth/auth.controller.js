import bcrypt from "bcryptjs";
import { User } from "../auth/user.model.js";
import { Tenant } from "../tenants/tenant.model.js";
import { ApiError } from "../../shared/errors/ApiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/jwt.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "strict",
  secure: isProduction,
};

export const register = async (req, res) => {
  const { email, password, role } = req.body;
  const tenantSlug = req.headers["x-tenant-slug"];

  if (!email || !password || !tenantSlug) {
    throw new ApiError(400, "Email, password and tenantSlug are required");
  }

  // Resolve or create tenant
  let tenant = await Tenant.findOne({ slug: tenantSlug });

  if (!tenant) {
    tenant = await Tenant.create({
      name: tenantSlug,
      slug: tenantSlug,
    });
  }

  // Prevent duplicate users inside same tenant
  const existingUser = await User.findOne({
    email,
    tenantId: tenant._id,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists in this tenant");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    tenantId: tenant._id,
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(201)
    .json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: tenant._id,
        tenantName: tenant.name,
        tenantSlug: tenant.slug
      },
    });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const tenantSlug = req.headers["x-tenant-slug"];

  if (!email || !password || !tenantSlug) {
    throw new ApiError(400, "Email, password and tenantSlug are required");
  }

  // 1. Find tenant
  const tenant = await Tenant.findOne({ slug: tenantSlug });
  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  // 2. Find user in that tenant
  const user = await User.findOne({
    email,
    tenantId: tenant._id
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: tenant.name,
        tenantSlug: tenant.slug
      },
    });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  const payload = verifyRefreshToken(token);

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = signAccessToken(user);

  res.json({ accessToken: newAccessToken });
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken").json({
    message: "Logged out successfully",
  });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  const tenant = await Tenant.findById(req.user.tenantId);

  if (!user || !tenant) {
    throw new ApiError(404, "User or Tenant not found");
  }

  res.json({
    ...user.toObject(),
    tenantName: tenant.name,
    tenantSlug: tenant.slug
  });
};
