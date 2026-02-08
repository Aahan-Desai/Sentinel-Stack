import { useState } from "react";
import { login as loginApi } from "../lib/auth.api.ts";

type User = {
  email: string;
  role: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  async function login(
    email: string,
    password: string,
    tenantSlug: string
  ) {
    const data = await loginApi({ email, password, tenantSlug });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("tenantSlug", tenantSlug);

    setUser(data.user);
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
