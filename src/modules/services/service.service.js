import { Service } from "./service.model.js";

/**
 * CREATE SERVICE
 */
export const createService = async ({ tenantId, name, url }) => {
  if (!name || !url) {
    throw new Error("Service name and URL are required");
  }

  const service = await Service.create({
    tenantId,
    name,
    url,
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
