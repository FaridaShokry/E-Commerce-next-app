"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

const slides = [
  { title: "Fresh Products Delivered to your Door", subtitle: "Get 20% off your first order" },
  { title: "Farm Fresh Vegetables Every Day", subtitle: "Picked this morning, at your door tonight" },
  { title: "Fruits You Will Love", subtitle: "Seasonal picks at great prices" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const slide = slides[current];
  const arrow =
    "absolute top-1/2 size-14 -translate-y-1/2 rounded-full bg-white/90 text-green-600 shadow hover:bg-white";

  return (
    <section
      className="relative h-[560px] overflow-hidden bg-green-700 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-green-500/80" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 md:px-[90px]">
        <div className="max-w-xl text-white">
          <h1 className="text-5xl font-bold leading-tight">{slide.title}</h1>
          <p className="mt-4 text-xl">{slide.subtitle}</p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/products"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-lg bg-white px-9 text-lg font-semibold text-green-600 hover:bg-green-50"
              )}
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-14 rounded-lg border-white/60 bg-transparent px-9 text-lg font-semibold text-white hover:bg-white/10 hover:text-white"
              )}
            >
              View Deals
            </Link>
          </div>
        </div>
      </div>

      <Button onClick={prev} size="icon" aria-label="Previous slide" className={cn(arrow, "left-5")}>
        <ChevronLeft className="size-6" />
      </Button>
      <Button onClick={next} size="icon" aria-label="Next slide" className={cn(arrow, "right-5")}>
        <ChevronRight className="size-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-3 rounded-full transition-all ${i === current ? "w-11 bg-white" : "w-3 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}