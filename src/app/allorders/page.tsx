"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package, ShoppingBag, Clock, CheckCircle2, Calendar, MapPin, Hash,
  Banknote, CreditCard, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserIdFromToken, getUserOrders, type Order } from "@/lib/api";
import { cn } from "@/lib/utils";

const money = (n: number) => n.toLocaleString("en-US");
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const first = order.cartItems?.[0]?.product;
  const extra = (order.cartItems?.length ?? 0) - 1;
  const itemCount = order.cartItems?.reduce((s, i) => s + i.count, 0) ?? 0;
  const delivered = order.isDelivered;

  return (
    <article className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative size-40 shrink-0 self-start">
          <div className="flex size-full items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-3">
            {first?.imageCover && (
              <Image src={first.imageCover} alt={first.title} width={120} height={120} className="size-full object-contain" />
            )}
          </div>
          {extra > 0 && (
            <span className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              +{extra}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
                  delivered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                )}
              >
                {delivered ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
                {delivered ? "Delivered" : "Processing"}
              </span>
              <p className="mt-3 flex items-center gap-2 text-3xl font-bold text-slate-900">
                <Hash className="size-5 text-slate-400" /> {order.id}
              </p>
            </div>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              {order.paymentMethodType === "cash" ? <Banknote className="size-6" /> : <CreditCard className="size-6" />}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500">
            <span className="flex items-center gap-2"><Calendar className="size-4" /> {fmtDate(order.createdAt)}</span>
            <span className="flex items-center gap-2"><Package className="size-4" /> {itemCount} {itemCount === 1 ? "item" : "items"}</span>
            {order.shippingAddress?.city && (
              <span className="flex items-center gap-2"><MapPin className="size-4" /> {order.shippingAddress.city}</span>
            )}
          </div>

          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-slate-900">
              {money(order.totalOrderPrice)} <span className="text-base font-normal text-slate-500">EGP</span>
            </p>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-medium text-slate-700 hover:bg-slate-200"
            >
              Details <ChevronDown className={cn("size-5 transition", open && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="mt-8 grid gap-8 border-t border-slate-100 pt-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Items</h3>
            {order.cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <span className="flex size-14 items-center justify-center rounded-lg bg-white p-1">
                  <Image src={item.product.imageCover} alt={item.product.title} width={48} height={48} className="size-full object-contain" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-medium text-slate-900">{item.product.title}</p>
                  <p className="text-sm text-slate-500">{item.count} × {money(item.price)} EGP</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-slate-600">
            <h3 className="font-semibold text-slate-900">Delivery &amp; Payment</h3>
            <p>{order.shippingAddress?.details}</p>
            <p>{order.shippingAddress?.city}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p className="pt-2">
              Payment: <span className="font-medium text-slate-900">{order.paymentMethodType === "cash" ? "Cash on Delivery" : "Card (Stripe)"}</span>
            </p>
            <p>
              Status: <span className="font-medium text-slate-900">{order.isPaid ? "Paid" : "Not paid yet"}</span>
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { token, ready } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!token) return router.replace("/login");
    const userId = getUserIdFromToken(token);
    if (!userId) return setError("Couldn't read your account. Please sign in again.");

    getUserOrders(userId, token)
      .then((list) =>
        setOrders([...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
      )
      .catch((e) => setError((e as Error).message));
  }, [ready, token, router]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <nav className="text-slate-500">
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">My Orders</span>
      </nav>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-20 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg">
            <Package className="size-9" />
          </span>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Orders</h1>
            {orders && (
              <p className="mt-1 text-lg text-slate-600">
                Track and manage your {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>
            )}
          </div>
        </div>
        <Link href="/" className="hidden items-center gap-2 text-lg text-green-600 hover:underline sm:flex">
          <ShoppingBag className="size-5" /> Continue Shopping
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
        {!error && !orders && <p className="py-16 text-center text-slate-500">Loading your orders...</p>}
        {orders?.length === 0 && (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">No orders yet</p>
            <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-xl bg-green-600 px-6 font-semibold text-white hover:bg-green-700">
              Start Shopping
            </Link>
          </div>
        )}
        {orders?.map((o) => <OrderCard key={o._id} order={o} />)}
      </div>
    </main>
  );
}