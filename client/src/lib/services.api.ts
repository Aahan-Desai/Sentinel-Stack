import { api } from "./api";
import type { Service } from "../types/service";

export async function fetchServices(): Promise<Service[]> {
  const res = await api.get("/services");

  // Defensive: ensure we always return an array
  if (!res.data || !Array.isArray(res.data.items)) {
    return [];
  }

  return res.data.items;
}
