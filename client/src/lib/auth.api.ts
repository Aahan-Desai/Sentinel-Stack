import api from "./api";

type LoginPayload = {
  email: string;
  password: string;
  tenantSlug: string;
};

export async function login({
  email,
  password,
  tenantSlug,
}: LoginPayload) {
  const response = await api.post(
    "/auth/login",
    { email, password },
    {
      headers: {
        "x-tenant-slug": tenantSlug,
      },
    }
  );

  return response.data;
}

export async function updateProfile(data: { displayName?: string; avatarUrl?: string | null }) {
  const response = await api.put("/users/profile", data);
  return response.data;
}
