"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart, ShoppingBag, Minus, Plus, Trash2, ArrowLeft, User,
  Truck, RotateCcw, ShieldCheck, Headset, Tag, Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const money = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const { token, ready } = useAuth();
  const { cart, loading, update, remove, clear } = useCart();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showClear, setShowClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  async function run(id: string, fn: () => Promise<void>) {
    setBusyId(id);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function confirmClear() {
    setClearing(true);
    setError("");
    try {
      await clear();
      setShowClear(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setClearing(false);
    }
  }

  if (!ready || (token && loading && !cart)) {
    return <p className="p-20 text-center text-slate-500">Loading your cart...</p>;
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <ShoppingCart className="size-9" />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">Sign in to view your cart</h1>
        <p className="mt-3 text-slate-600">Your cart is saved to your account.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-green-600 px-8 text-lg font-semibold text-white hover:bg-green-700"
        >
          <User className="size-5" /> Login
        </Link>
        <p className="mt-4 text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-green-600 hover:underline">Sign up</Link>
        </p>
      </main>
    );
  }

  const items = cart?.data.products ?? [];

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <ShoppingCart className="size-9" />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-14 items-center rounded-xl bg-green-600 px-8 text-lg font-semibold text-white hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  const itemCount = cart?.numOfCartItems ?? items.length;
  const total = cart?.data.totalCartPrice ?? 0;

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb + title */}
        <nav className="text-slate-500">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">Shopping Cart</span>
        </nav>

        <div className="mt-6 flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-green-600 text-white">
            <ShoppingCart className="size-8" />
          </span>
          <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>
        </div>
        <p className="mt-4 text-lg text-slate-600">
          You have <span className="font-semibold text-green-600">{itemCount} {itemCount === 1 ? "item" : "items"}</span> in your cart
        </p>

        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <section>
            <div className="space-y-6">
              {items.map((item) => {
                const busy = busyId === item.product._id;
                return (
                  <article
                    key={item._id}
                    className={cn(
                      "flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm transition sm:flex-row",
                      busy && "opacity-60"
                    )}
                  >
                    <Link
                      href={`/products/${item.product._id}`}
                      className="flex size-32 shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-3"
                    >
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title}
                        width={112}
                        height={112}
                        className="size-full object-contain"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <h2 className="text-xl font-semibold text-slate-900">{item.product.title}</h2>
                      {item.product.category?.name && (
                        <span className="mt-2 w-fit rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
                          {item.product.category.name}
                        </span>
                      )}
                      <p className="mt-3 text-xl font-bold text-green-600">{money(item.price)} EGP</p>

                      <div className="mt-auto flex items-end justify-between pt-4">
                        {/* Quantity stepper */}
                        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                          <button
                            aria-label="Decrease quantity"
                            disabled={busy || item.count <= 1}
                            onClick={() => run(item.product._id, () => update(item.product._id, item.count - 1))}
                            className="flex size-10 items-center justify-center rounded-lg bg-white text-slate-600 disabled:opacity-40"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-10 text-center font-semibold">{item.count}</span>
                          <button
                            aria-label="Increase quantity"
                            disabled={busy}
                            onClick={() => run(item.product._id, () => update(item.product._id, item.count + 1))}
                            className="flex size-10 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        {/* Line total + delete */}
                        <div className="flex items-end gap-4">
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Total</p>
                            <p className="text-2xl font-bold text-slate-900">
                              {money(item.price * item.count)}{" "}
                              <span className="text-sm font-normal text-slate-500">EGP</span>
                            </p>
                          </div>
                          <button
                            aria-label={`Remove ${item.product.title}`}
                            disabled={busy}
                            onClick={() => run(item.product._id, () => remove(item.product._id))}
                            className="flex size-12 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-60"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <Link href="/" className="flex items-center gap-2 text-lg text-green-600 hover:underline">
                <ArrowLeft className="size-5" /> Continue Shopping
              </Link>
              <button
                onClick={() => setShowClear(true)}
                className="flex items-center gap-2 text-lg text-slate-500 hover:text-red-500"
              >
                <Trash2 className="size-5" /> Clear all items
              </button>
            </div>
          </section>

          {}
          <aside className="overflow-hidden rounded-2xl bg-white shadow-md lg:sticky lg:top-6">
  <div className="bg-gradient-to-r from-green-500 to-green-700 px-7 py-6 text-white">
    <h2 className="flex items-center gap-3 text-2xl font-bold">
      <ShoppingBag className="size-6" /> Order Summary
    </h2>
    <p className="mt-1">{itemCount} {itemCount === 1 ? "item" : "items"} in your cart</p>
  </div>

  <div className="p-7">
    {total >= 500 && (
      <div className="flex items-center gap-4 rounded-xl bg-green-50 p-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Truck className="size-5" />
        </span>
        <div>
          <p className="font-semibold text-green-700">Free Shipping!</p>
          <p className="text-green-600">You qualify for free delivery</p>
        </div>
      </div>
    )}

    <div className="mt-6 flex items-center justify-between text-lg text-slate-700">
      <span>Subtotal</span>
      <span>{money(total)} EGP</span>
    </div>
    <div className="mt-3 flex items-center justify-between text-lg text-slate-700">
      <span>Shipping</span>
      <span className="font-semibold text-green-600">
        {total >= 500 ? "FREE" : "Calculated at checkout"}
      </span>
    </div>

    <div className="mt-5 flex items-center justify-between border-t border-dashed border-slate-200 pt-5">
      <span className="text-xl font-bold text-slate-900">Total</span>
      <span className="text-3xl font-bold text-slate-900">
        {money(total)} <span className="text-base font-normal text-slate-500">EGP</span>
      </span>
    </div>

    <button
      type="button"
      className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
    >
      <Tag className="size-5" /> Apply Promo Code
    </button>

    <Link
      href="/checkout"
      className="mt-4 flex h-16 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-lg font-semibold text-white shadow-lg hover:opacity-95"
    >
      <Lock className="size-5" /> Secure Checkout
    </Link>

    <div className="mt-5 flex items-center justify-center gap-5 text-sm text-slate-500">
      <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-green-600" /> Secure Payment</span>
      <span className="h-4 w-px bg-slate-200" />
      <span className="flex items-center gap-1.5"><Truck className="size-4 text-blue-500" /> Fast Delivery</span>
    </div>

    <Link href="/" className="mt-8 block text-center text-lg text-green-600 hover:underline">
      ← Continue Shopping
    </Link>
  </div>
</aside>
        </div>
      </main>

      {}
      <section className="mt-6 border-y border-green-100 bg-green-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP" },
            { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy" },
            { icon: ShieldCheck, title: "Secure Payment", text: "100% secure checkout" },
            { icon: Headset, title: "24/7 Support", text: "Contact us anytime" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Icon className="size-6" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ClearCartModal
        open={showClear}
        busy={clearing}
        onCancel={() => setShowClear(false)}
        onConfirm={confirmClear}
      />
    </>
  );
}

function ClearCartModal({
  open, busy, onCancel, onConfirm,
}: {
  open: boolean;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
      >
        <span className="mx-auto flex size-28 items-center justify-center rounded-full bg-red-50 text-red-500">
          <ShoppingCart className="size-12" />
        </span>
        <h2 id="clear-title" className="mt-6 text-3xl font-bold text-slate-900">Clear Your Cart?</h2>
        <p className="mt-3 text-slate-500">
          All items will be removed from your cart. This action cannot be undone.
        </p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={onCancel}
            disabled={busy}
            className="h-14 flex-1 rounded-xl bg-slate-100 text-lg font-semibold text-slate-700 hover:bg-slate-200"
          >
            Keep Shopping
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="h-14 flex-1 rounded-xl bg-red-500 text-lg font-semibold text-white shadow-lg shadow-red-200 hover:bg-red-600 disabled:opacity-60"
          >
            {busy ? "Clearing..." : "Yes, Clear All"}
          </button>
        </div>
      </div>
    </div>
  );
}