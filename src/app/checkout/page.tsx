"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home, Info, Building2, MapPin, Phone, Wallet, Banknote, CreditCard, Check,
  ShieldCheck, Truck, Package, ShoppingBag, RotateCcw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createCashOrder, createCheckoutSession } from "@/lib/api";
import { cn } from "@/lib/utils";

const money = (n: number) => n.toLocaleString("en-US");

type Method = "cash" | "card";

function Header({ icon: Icon, title, subtitle }: { icon: typeof Home; title: string; subtitle: string }) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-700 px-8 py-6 text-white">
      <h2 className="flex items-center gap-3 text-2xl font-bold">
        <Icon className="size-6" /> {title}
      </h2>
      <p className="mt-1">{subtitle}</p>
    </div>
  );
}

function CardBrands() {
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="rounded bg-blue-700 px-1.5 py-0.5 text-[10px] font-bold italic text-white">VISA</span>
      <span className="flex h-5 w-8 items-center justify-center rounded bg-white ring-1 ring-slate-200">
        <span className="size-3 rounded-full bg-red-500" />
        <span className="-ml-1 size-3 rounded-full bg-orange-400" />
      </span>
      <span className="rounded bg-sky-600 px-1.5 py-0.5 text-[10px] font-bold text-white">AMEX</span>
    </div>
  );
}

function PayOption({
  selected, onSelect, icon: Icon, title, text, tone, children,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: typeof Home;
  title: string;
  text: string;
  tone: "cash" | "card";
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-5 rounded-2xl border p-6 text-left transition",
        selected
          ? tone === "card"
            ? "border-green-500 bg-gradient-to-r from-green-50 to-sky-50"
            : "border-green-500 bg-green-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <span
        className={cn(
          "flex size-20 shrink-0 items-center justify-center rounded-2xl",
          selected
            ? tone === "card"
              ? "bg-gradient-to-br from-emerald-400 to-blue-500 text-white shadow-lg"
              : "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg"
            : "bg-slate-100 text-slate-500"
        )}
      >
        <Icon className="size-8" />
      </span>
      <span className="flex-1">
        <span className={cn("block text-xl font-semibold", selected ? "text-green-700" : "text-slate-900")}>{title}</span>
        <span className="mt-1 block text-slate-600">{text}</span>
        {children}
      </span>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white"
        )}
      >
        {selected && <Check className="size-5" />}
      </span>
    </button>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { token, ready } = useAuth();
  const { cart, loading, refresh } = useCart();

  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<Method>("cash");
  const [errors, setErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);

  if (placed) {
    return <p className="p-20 text-center text-lg text-slate-600">Order placed! Taking you to your orders...</p>;
  }
  if (!ready || !token || loading) {
    return <p className="p-20 text-center text-slate-500">Loading...</p>;
  }

  const items = cart?.data.products ?? [];
  if (!cart || items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add some products before checking out.</p>
        <Link href="/" className="mt-8 inline-flex h-14 items-center rounded-xl bg-green-600 px-8 text-lg font-semibold text-white hover:bg-green-700">
          Continue Shopping
        </Link>
      </main>
    );
  }

  const total = cart.data.totalCartPrice;

  function validate() {
    const errs: string[] = [];
    if (!city.trim()) errs.push("Please enter your city");
    if (details.trim().length < 5) errs.push("Please enter your full street address");
    if (!/^01[0125][0-9]{8}$/.test(phone.trim())) errs.push("Please enter a valid Egyptian phone number");
    return errs;
  }

  async function submit() {
    if (!cart || !token) return;
    const errs = validate();
    setErrors(errs);
    if (errs.length) return;

    setSubmitting(true);
    setServerError("");
    const address = { details: details.trim(), phone: phone.trim(), city: city.trim() };

    try {
      if (method === "cash") {
        await createCashOrder(cart.cartId, address, token);
        setPlaced(true);
        await refresh();
        router.push("/allorders");
      } else {
        const res = await createCheckoutSession(cart.cartId, address, token, window.location.origin);
        window.location.href = res.session.url;
      }
    } catch (e) {
      setPlaced(false);
      setServerError((e as Error).message);
      setSubmitting(false);
    }
  }

  const iconBox = "flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500";
  const fieldBox =
    "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_440px]">
        {/* LEFT */}
        <div className="space-y-8">
          {/* Shipping address */}
          <section className="overflow-hidden rounded-3xl bg-white shadow-md">
            <Header icon={Home} title="Shipping Address" subtitle="Where should we deliver your order?" />
            <div className="space-y-6 p-8">
              <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Info className="size-5" />
                </span>
                <div>
                  <p className="font-medium text-blue-900">Delivery Information</p>
                  <p className="text-sm text-blue-700">Please ensure your address is accurate for smooth delivery</p>
                </div>
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block font-medium text-slate-900">
                  City <span className="text-red-500">*</span>
                </label>
                <div className={cn(fieldBox, "h-16")}>
                  <span className={iconBox}><Building2 className="size-5" /></span>
                  <input
                    id="city" value={city} onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Cairo, Alexandria, Giza"
                    className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="details" className="mb-2 block font-medium text-slate-900">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className={cn(fieldBox, "items-start py-4")}>
                  <span className={iconBox}><MapPin className="size-5" /></span>
                  <textarea
                    id="details" rows={3} value={details} onChange={(e) => setDetails(e.target.value)}
                    placeholder="Street name, building number, floor, apartment..."
                    className="flex-1 resize-none bg-transparent pt-2 text-base outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block font-medium text-slate-900">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className={cn(fieldBox, "h-16")}>
                  <span className={iconBox}><Phone className="size-5" /></span>
                  <input
                    id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                  />
                  <span className="hidden text-sm text-slate-400 sm:inline">Egyptian numbers only</span>
                </div>
              </div>

              {errors.length > 0 && (
                <ul className="space-y-1 rounded-xl bg-red-50 p-4 text-red-600">
                  {errors.map((e) => <li key={e}>• {e}</li>)}
                </ul>
              )}
            </div>
          </section>

          {/* Payment method */}
          <section className="overflow-hidden rounded-3xl bg-white shadow-md">
            <Header icon={Wallet} title="Payment Method" subtitle="Choose how you'd like to pay" />
            <div role="radiogroup" className="space-y-5 p-8">
              <PayOption
                tone="cash" selected={method === "cash"} onSelect={() => setMethod("cash")}
                icon={Banknote} title="Cash on Delivery" text="Pay when your order arrives at your doorstep"
              />
              <PayOption
                tone="card" selected={method === "card"} onSelect={() => setMethod("card")}
                icon={CreditCard} title="Pay Online" text="Secure payment with Credit/Debit Card via Stripe"
              >
                <CardBrands />
              </PayOption>

              <div className="flex items-center gap-4 rounded-2xl bg-green-50 p-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <ShieldCheck className="size-6" />
                </span>
                <div>
                  <p className="font-medium text-green-800">Secure &amp; Encrypted</p>
                  <p className="text-sm text-green-700">Your payment info is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT: summary */}
        <aside className="overflow-hidden rounded-3xl bg-white shadow-md lg:sticky lg:top-6">
          <Header
            icon={ShoppingBag}
            title="Order Summary"
            subtitle={`${items.length} ${items.length === 1 ? "item" : "items"}`}
          />
          <div className="p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white p-1">
                    <Image
                      src={item.product.imageCover} alt={item.product.title}
                      width={56} height={56} className="size-full object-contain"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium text-slate-900">{item.product.title}</p>
                    <p className="text-sm text-slate-500">{item.count} × {money(item.price)} EGP</p>
                  </div>
                  <span className="font-bold text-slate-900">{money(item.price * item.count)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-lg text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{money(total)} EGP</span></div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Truck className="size-5 text-slate-400" /> Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xl font-bold text-slate-900">Total</span>
              <span className="text-3xl font-bold text-green-600">
                {money(total)} <span className="text-base font-normal text-slate-500">EGP</span>
              </span>
            </div>

            {serverError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</p>}

            <button
              onClick={submit}
              disabled={submitting}
              className="mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 text-lg font-semibold text-white shadow-lg hover:opacity-95 disabled:opacity-60"
            >
              {method === "cash" ? <ShoppingBag className="size-5" /> : <ShieldCheck className="size-5" />}
              {submitting ? "Please wait..." : method === "cash" ? "Place Order" : "Proceed to Payment"}
            </button>

            <div className="mt-5 flex items-center justify-center gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-green-600" /> Secure</span>
              <span className="flex items-center gap-1.5"><Truck className="size-4 text-blue-500" /> Fast Delivery</span>
              <span className="flex items-center gap-1.5"><RotateCcw className="size-4 text-orange-500" /> Easy Returns</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}