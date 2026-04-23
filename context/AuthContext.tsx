"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi, User, ApiError } from "@/services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
      // Re-sync cookie in case it expired or was missing (e.g. after hard refresh)
      document.cookie = `token=${t}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { token: t, user: u } = res.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    // Set cookie so Next.js middleware can read it for server-side route protection
    document.cookie = `token=${t}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    setToken(t);
    setUser(u);
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string, role = "user") => {
    await authApi.register(name, email, password, role);
    router.push("/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Clear the cookie used by Next.js middleware
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
