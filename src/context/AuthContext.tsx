"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = { name: string; email: string } | null;
type AuthCtx = {
  token: string | null;
  user: User;
  ready: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
    setReady(true);
  }, []);

  const login = (t: string, u: User) => {
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ token, user, ready, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};