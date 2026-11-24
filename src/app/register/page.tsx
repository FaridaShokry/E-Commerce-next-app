"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Truck, ShieldCheck, UserPlus } from "lucide-react";
import { signUp } from "@/lib/api";
import { GoogleIcon, FacebookIcon } from "@/components/SocialIcons";
import { cn } from "@/lib/utils";

const strengthLevels = [
  { label: "Weak", bar: "bg-red-500", text: "text-red-500" },
  { label: "Fair", bar: "bg-orange-500", text: "text-orange-500" },
  { label: "Good", bar: "bg-yellow-500", text: "text-yellow-600" },
  { label: "Strong", bar: "bg-green-600", text: "text-green-600" },
];

function getScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", rePassword: "", phone: "" });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const score = form.password ? Math.max(getScore(form.password), 1) : 0;
  const level = strengthLevels[Math.max(score - 1, 0)];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.rePassword) return setError("Passwords don't match");
    if (!agree) return setError("Please accept the Terms of Service and Privacy Policy");
    setLoading(true);
    try {
      await signUp(form);
      router.push("/login");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const input =
    "h-14 w-full rounded-lg border border-slate-200 bg-white px-4 text-base outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";
  const label = "mb-2 block font-medium text-slate-800";
  const star = <span className="text-slate-400">*</span>;

  const features = [
    { icon: Star, title: "Premium Quality", text: "Premium quality products sourced from trusted suppliers." },
    { icon: Truck, title: "Fast Delivery", text: "Same-day delivery available in most areas" },
    { icon: ShieldCheck, title: "Secure Shopping", text: "Your data and payments are completely secure" },
  ];

  return (
    <main className="mx-auto grid max-w-7xl items-start gap-12 px-6 py-12 lg:grid-cols-2">
      {/* Left: welcome */}
      <section className="hidden lg:block">
        <h1 className="text-5xl font-bold text-slate-900">
          Welcome to <span className="text-green-600">FreshCart</span>
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
        </p>

        <ul className="mt-10 space-y-6">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Icon className="size-6" />
              </span>
              <div>
                <p className="text-lg font-semibold text-slate-900">{title}</p>
                <p className="text-slate-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <figure className="mt-10 rounded-xl bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
              SJ
            </span>
            <div>
              <p className="font-medium text-slate-900">Sarah Johnson</p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <blockquote className="mt-4 italic text-slate-600">
            &quot;FreshCart has transformed my shopping experience. The quality of the products is
            outstanding, and the delivery is always on time. Highly recommended!&quot;
          </blockquote>
        </figure>
      </section>

      {/* Right: form */}
      <section className="rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800">Create Your Account</h2>
          <p className="mt-3 text-lg text-slate-700">Start your fresh journey with us today</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button type="button" className="flex h-14 items-center justify-center gap-2 rounded-lg border border-slate-200 font-medium hover:bg-slate-50">
            <GoogleIcon /> Google
          </button>
          <button type="button" className="flex h-14 items-center justify-center gap-2 rounded-lg border border-slate-200 font-medium hover:bg-slate-50">
            <FacebookIcon /> Facebook
          </button>
        </div>

        <div className="my-6 flex items-center gap-4 text-slate-600">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className={label}>Name{star}</label>
            <input id="name" required placeholder="Ali" className={input} value={form.name} onChange={set("name")} />
          </div>

          <div>
            <label htmlFor="email" className={label}>Email{star}</label>
            <input id="email" type="email" required placeholder="ali@example.com" className={input} value={form.email} onChange={set("email")} />
          </div>

          <div>
            <label htmlFor="password" className={label}>Password{star}</label>
            <input id="password" type="password" required placeholder="create a strong password" className={input} value={form.password} onChange={set("password")} />
            <div className="mt-2 flex items-center gap-4">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn("h-full rounded-full transition-all", level.bar)}
                  style={{ width: `${score * 25}%` }}
                />
              </div>
              <span className={cn("text-sm", score ? level.text : "text-slate-600")}>{level.label}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Must be at least 8 characters with numbers and symbols</p>
          </div>

          <div>
            <label htmlFor="rePassword" className={label}>Confirm Password{star}</label>
            <input id="rePassword" type="password" required placeholder="confirm your password" className={input} value={form.rePassword} onChange={set("rePassword")} />
          </div>

          <div>
            <label htmlFor="phone" className={label}>Phone Number{star}</label>
            <input id="phone" type="tel" required placeholder="01012345678" className={input} value={form.phone} onChange={set("phone")} />
          </div>

          <label className="flex items-start gap-3 text-slate-700">
            <input
              type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 size-5 rounded border-slate-300 accent-green-600"
            />
            <span>
              I agree to the <Link href="#" className="text-green-600 hover:underline">Terms of Service</Link> and{" "}
              <Link href="#" className="text-green-600 hover:underline">Privacy Policy</Link> {star}
            </span>
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-green-600 text-lg font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            <UserPlus className="size-5" />
            {loading ? "Creating..." : "Create My Account"}
          </button>
        </form>

        <p className="mt-8 border-t border-slate-100 pt-6 text-center text-lg text-slate-700">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-600 hover:underline">Sign In</Link>
        </p>
      </section>
    </main>
  );
}