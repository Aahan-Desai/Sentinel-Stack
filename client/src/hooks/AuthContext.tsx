import { createContext, useContext, useState } from "react";
import * as authApi from "../lib/auth.api";

type User = {
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantSlug: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function login(
    email: string,
    password: string,
    tenantSlug: string
  ) {
    if (typeof authApi.login !== "function") {
      throw new Error("authApi.login is not a function");
    }

    const data = await authApi.login({
      email,
      password,
      tenantSlug,
    });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("tenantSlug", tenantSlug);

    setUser(data.user);
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
