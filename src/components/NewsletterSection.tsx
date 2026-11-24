"use client";

import { useState, type FormEvent } from "react";
import {
  Mail,
  Leaf,
  Truck,
  Tag,
  ArrowRight,
  CircleCheck,
  Apple,
  Play,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const perks = [
  { icon: Leaf, label: "Fresh Picks Weekly" },
  { icon: Truck, label: "Free Delivery Codes" },
  { icon: Tag, label: "Members-Only Deals" },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (subscribed) return;

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubscribed(true); 
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="rounded-[32px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-emerald-50 p-6 shadow-sm lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.45fr_1fr]">
          {}
          <div className="lg:border-r lg:border-emerald-100 lg:pr-8">
            <div className="flex items-center gap-3">
              <span className="flex size-14 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                <Mail className="size-6" />
              </span>
              <div>
                <p className="text-base font-medium uppercase text-emerald-600">Newsletter</p>
                <p className="text-sm text-slate-500">50,000+ subscribers</p>
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
              Get the Freshest Updates
              <br />
              <span className="text-emerald-600">Delivered Free</span>
            </h2>
            <p className="mt-3 text-base text-slate-500 lg:text-lg">
              Weekly recipes, seasonal offers &amp; exclusive member perks.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {perks.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-emerald-100"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={subscribed}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  aria-invalid={!!error}
                  className="h-14 flex-1 rounded-xl border-slate-200 bg-white px-5 text-base shadow-sm md:text-base"
                />
                <Button
                  type="submit"
                  disabled={subscribed}
                  className={cn(
                    "h-14 rounded-xl px-6 text-base font-semibold text-white shadow-lg transition-all disabled:opacity-100",
                    subscribed
                      ? "bg-emerald-500 shadow-emerald-200"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-emerald-200 hover:from-emerald-700 hover:to-emerald-500"
                  )}
                >
                  {subscribed ? (
                    <>
                      <CircleCheck className="size-5 fill-white text-emerald-500" />
                      You&apos;re In!
                    </>
                  ) : (
                    <>
                      Subscribe <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>

              <p
                aria-live="polite"
                className={cn("mt-3 text-xs", error ? "text-red-500" : "text-slate-400")}
              >
                {error || "✨ Unsubscribe anytime. No spam, ever."}
              </p>
            </form>
          </div>

          {}
          <div className="rounded-[28px] bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950 p-7 text-white shadow-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1.5 text-sm text-emerald-400">
              📱 Mobile App
            </span>
            <h3 className="mt-4 text-2xl font-bold">Shop Faster on Our App</h3>
            <p className="mt-3 text-base text-slate-300">
              Get app-exclusive deals &amp; 15% off your first order.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Button
                variant="outline"
                className="h-16 justify-start gap-4 rounded-xl border-white/10 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"
              >
                <Apple className="size-6 fill-white" />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-normal uppercase text-slate-300">Download on</span>
                  <span className="text-base font-semibold">App Store</span>
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-16 justify-start gap-4 rounded-xl border-white/10 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"
              >
                <Play className="size-6 fill-white" />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-normal uppercase text-slate-300">Get it on</span>
                  <span className="text-base font-semibold">Google Play</span>
                </span>
              </Button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </span>
              4.9 · 100K+ downloads
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}