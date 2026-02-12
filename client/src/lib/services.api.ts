import api from "./api";
import type { Service } from "../types/service";

export async function fetchServices(): Promise<Service[]> {
  const res = await api.get("/services");

  return Array.isArray(res.data.items) ? res.data.items : [];
}

export async function createService(payload: {
  name: string;
  url: string;
}): Promise<Service> {
  const res = await api.post("/services", payload);

  return res.data;
}

export async function fetchServiceHistory(serviceId: string): Promise<any[]> {
  const res = await api.get(`/services/${serviceId}/history`);
  return res.data;
}

export async function fetchServiceById(serviceId: string): Promise<Service> {
  const res = await api.get(`/services/${serviceId}`);
  return res.data;
}

export async function fetchServiceStatus(serviceId: string): Promise<{
  status: 'up' | 'down' | 'unknown';
  uptime: number | null;
}> {
  const res = await api.get(`/services/${serviceId}/status`);
  return res.data;
}

export async function updateService(
  serviceId: string,
  payload: { name?: string; url?: string }
): Promise<Service> {
  const res = await api.patch(`/services/${serviceId}`, payload);
  return res.data;
}

export async function deleteService(serviceId: string): Promise<void> {
  await api.delete(`/services/${serviceId}`);
}

export async function fetchGlobalStats(): Promise<{
  globalUptime: number;
  avgLatency: number;
}> {
  const res = await api.get("/services/stats/global");
  return res.data;
}
