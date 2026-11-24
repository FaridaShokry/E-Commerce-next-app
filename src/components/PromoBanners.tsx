import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const promos = [
  {
    badge: "🔥 Deal of the Day",
    title: "Fresh Organic Fruits",
    text: "Get up to 40% off on selected organic fruits",
    discount: "40% OFF",
    code: "ORGANIC40",
    button: "Shop Now",
    gradient: "from-emerald-500 to-emerald-800",
    buttonColor: "text-emerald-600",
  },
  {
    badge: "✨ New Arrivals",
    title: "Exotic Vegetables",
    text: "Discover our latest collection of premium vegetables",
    discount: "25% OFF",
    code: "FRESH25",
    button: "Explore Now",
    gradient: "from-orange-500 to-rose-500",
    buttonColor: "text-orange-500",
  },
];

export default function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {promos.map((p) => (
          <div
            key={p.title}
            className={`relative min-h-[420px] overflow-hidden rounded-3xl bg-gradient-to-br ${p.gradient} p-11 text-white`}
          >
            <span className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
            <span className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative">
              <span className="inline-block rounded-full bg-white/20 px-5 py-2 text-lg">
                {p.badge}
              </span>
              <h2 className="mt-5 text-5xl font-bold">{p.title}</h2>
              <p className="mt-4 text-xl text-white/90">{p.text}</p>

              <div className="mt-6 flex flex-wrap items-baseline gap-5">
                <span className="text-5xl font-bold">{p.discount}</span>
                <span className="text-lg text-white/80">
                  Use code: <b className="text-white">{p.code}</b>
                </span>
              </div>

              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-8 h-16 rounded-full bg-white px-8 text-xl font-semibold shadow-md hover:bg-white hover:shadow-xl",
                  p.buttonColor
                )}
              >
                {p.button} <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}