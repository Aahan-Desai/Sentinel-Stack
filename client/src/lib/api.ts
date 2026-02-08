import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5111",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const tenant = localStorage.getItem("tenantSlug");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenant) {
    config.headers["x-tenant-slug"] = tenant;
  }

  return config;
});
