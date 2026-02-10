import api from "./api";
import type { Service } from "../types/service";

/**
 * Fetch services for the current tenant
 */
export async function fetchServices(): Promise<Service[]> {
  const res = await api.get("/services");

  return Array.isArray(res.data.items) ? res.data.items : [];
}

/**
 * Create a new service (admin only)
 */
export async function createService(payload: {
  name: string;
  url: string;
}): Promise<Service> {
  const res = await api.post("/services", payload);

  return res.data;
}

/**
 * Fetch historical health checks for a service
 */
export async function fetchServiceHistory(serviceId: string): Promise<any[]> {
  const res = await api.get(`/services/${serviceId}/history`);
  return res.data;
}

/**
 * Fetch a single service by ID
 */
export async function fetchServiceById(serviceId: string): Promise<Service> {
  const res = await api.get(`/services/${serviceId}`);
  return res.data;
}

/**
 * Fetch service status and uptime
 */
export async function fetchServiceStatus(serviceId: string): Promise<{
  status: 'up' | 'down' | 'unknown';
  uptime: number | null;
}> {
  const res = await api.get(`/services/${serviceId}/status`);
  return res.data;
}
