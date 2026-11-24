"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Truck, ShieldCheck, Clock, Users, Star } from "lucide-react";
import { signIn } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { GoogleIcon, FacebookIcon } from "@/components/SocialIcons";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [keep, setKeep] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn(form);
      login(res.token, res.user);
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const social =
    "flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-base font-medium text-slate-800 transition hover:bg-slate-50";
  const field =
    "flex h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100";

  return (
    <main className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
      {/* Left: promo */}
      <section className="hidden flex-col items-center text-center lg:flex">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
         <Image
  src="/image/login-cart.png"
  alt="Shopping cart full of fresh vegetables"
  width={640}
  height={420}
  priority
  className="h-[620px] w-[640px] object-cover"
/>
        </div>
        <h2 className="mt-8 text-3xl font-bold text-slate-900">
          FreshCart - Your One-Stop Shop for Fresh Products
        </h2>
        <p className="mt-4 max-w-lg text-lg text-slate-600">
          Join thousands of happy customers who trust FreshCart for their daily grocery needs
        </p>
        <div className="mt-6 flex items-center gap-8 text-slate-600">
          <span className="flex items-center gap-2"><Truck className="size-5 text-green-600" /> Free Delivery</span>
          <span className="flex items-center gap-2"><ShieldCheck className="size-5 text-green-600" /> Secure Payment</span>
          <span className="flex items-center gap-2"><Clock className="size-5 text-green-600" /> 24/7 Support</span>
        </div>
      </section>

      {/* Right: form card */}
      <section className="rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <p className="text-4xl font-bold">
            <span className="text-green-600">Fresh</span>
            <span className="text-slate-900">Cart</span>
          </p>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">Welcome Back!</h1>
          <p className="mt-3 text-lg text-slate-600">Sign in to continue your fresh shopping experience</p>
        </div>

        <div className="mt-8 space-y-4">
          <button type="button" className={social}><GoogleIcon /> Continue with Google</button>
          <button type="button" className={social}><FacebookIcon /> Continue with Facebook</button>
        </div>

        <div className="my-8 flex items-center gap-4 text-sm uppercase text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />
          Or continue with email
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block font-medium text-slate-900">Email Address</label>
            <div className={field}>
              <Mail className="size-5 text-slate-400" />
              <input
                id="email" type="email" required placeholder="Enter your email"
                className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="font-medium text-slate-900">Password</label>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className={field}>
              <Lock className="size-5 text-slate-400" />
              <input
                id="password" type={showPassword ? "text" : "password"} required placeholder="Enter your password"
                className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-500 hover:text-slate-800"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 text-slate-700">
            <input
              type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)}
              className="size-5 rounded border-slate-300 accent-green-600"
            />
            Keep me signed in
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="h-14 w-full rounded-xl bg-green-600 text-lg font-semibold text-white shadow transition hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-lg text-slate-700">
          New to FreshCart?{" "}
          <Link href="/register" className="font-semibold text-green-600 hover:underline">
            Create an account
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Lock className="size-4" /> SSL Secured</span>
          <span className="flex items-center gap-1.5"><Users className="size-4" /> 50K+ Users</span>
          <span className="flex items-center gap-1.5"><Star className="size-4 fill-slate-500" /> 4.9 Rating</span>
        </div>
      </section>
    </main>
  );
}