import { api } from "./api";

export type LoginPayload = {
  email: string;
  password: string;
  tenantSlug: string;
};

export async function login(payload: LoginPayload) {
  const res = await api.post("/auth/login", payload);
  return res.data;
}
