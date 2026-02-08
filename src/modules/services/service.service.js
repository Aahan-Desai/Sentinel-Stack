import { Service } from "./service.model.js";

export const createService = async ({ tenantId, name, url }) => {
  if (!name || !url) {
    throw new Error("Service name and URL are required");
  }

  return await Service.create({
    tenantId,
    name,
    url,
  });
};
