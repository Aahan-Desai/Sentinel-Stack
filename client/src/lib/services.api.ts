import api from "./api";
import type { Service } from "../types/service";

export async function fetchServices(): Promise<Service[]> {
  const res = await api.get("/services");
  return Array.isArray(res.data.services) ? res.data.services : [];
}

export async function createService(payload: {
  name: string;
  url: string;
}): Promise<Service> {  
  const res = await api.post("/services", payload);
  return res.data.services;
}
