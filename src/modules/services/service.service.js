import { Service } from "./service.model.js";
import { Check } from "../checks/check.model.js";
import { CheckResult } from "../results/checkResult.model.js";
import { ApiError } from "../../shared/errors/ApiError.js";

/**
 * CREATE SERVICE
 */
export const createService = async ({ tenantId, name, url }) => {
  if (!name || !url) {
    throw new ApiError(400, "Service name and URL are required");
  }

  const existing = await Service.findOne({ tenantId, url });
  if (existing) {
    throw new ApiError(409, "A service with this URL already exists for this tenant");
  }

  const service = await Service.create({
    tenantId,
    name,
    url,
  });

  // Provision a default check for this service
  await Check.create({
    serviceId: service._id,
    url: service.url,
    interval: 60, // Default to 60 seconds
  });

  return service;
};

/**
 * LIST SERVICES (pagination-ready)
 */
export const listServices = async ({
  tenantId,
  page = 1,
  limit = 20,
}) => {
  const skip = (page - 1) * limit;

  const [services, total] = await Promise.all([
    Service.find({ tenantId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Service.countDocuments({ tenantId }),
  ]);

  return {
    items: services,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * GET SERVICE BY ID
 */
export const getServiceById = async ({ serviceId, tenantId }) => {
  const service = await Service.findOne({ _id: serviceId, tenantId });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

/**
 * GET SERVICE HISTORY
 */
export const getServiceHistory = async ({ serviceId, tenantId, limit = 50 }) => {
  const service = await Service.findOne({ _id: serviceId, tenantId });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const check = await Check.findOne({ serviceId: service._id });
  if (!check) return [];

  const results = await CheckResult.find({ checkId: check._id })
    .sort({ checkedAt: -1 })
    .limit(limit);

  return results;
};
