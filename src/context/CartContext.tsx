"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import * as api from "@/lib/api";

type CartCtx = {
  cart: api.Cart | null;
  loading: boolean;
  count: number;
  add: (productId: string) => Promise<void>;
  update: (productId: string, count: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<api.Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return setCart(null);
    setLoading(true);
    try {
      setCart(await api.getCart(token));
    } catch {
      setCart(null); // empty cart returns an error on some accounts
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const need = () => {
    if (!token) throw new Error("Please sign in first");
    return token;
  };

  const add = async (id: string) => setCart(await api.addToCart(id, need()));
  const update = async (id: string, count: number) =>
    setCart(await api.updateCartItem(id, count, need()));
  const remove = async (id: string) => setCart(await api.removeCartItem(id, need()));
  const clear = async () => { await api.clearCart(need()); setCart(null); };

  return (
    <Ctx.Provider value={{ cart, loading, count: cart?.numOfCartItems ?? 0, add, update, remove, clear, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};