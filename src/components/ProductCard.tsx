"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Heart, RefreshCw, Eye, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const finalPrice = hasDiscount ? product.priceAfterDiscount! : product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.priceAfterDiscount! / product.price) * 100)
    : 0;
  const stars = Math.round(product.ratingsAverage);
  const iconBtn =
    "size-11 rounded-full bg-white text-slate-700 shadow-sm hover:bg-green-50 hover:text-green-600";
const router = useRouter();
const { token } = useAuth();
const { add } = useCart();
const [adding, setAdding] = useState(false);

async function handleAdd() {
  if (!token) return router.push("/login");
  setAdding(true);
  try {
    await add(product._id);
  } catch (err) {
    alert((err as Error).message);
  } finally {
    setAdding(false);
  }
}
  return (
    <Card className="relative gap-0 overflow-hidden py-0 shadow-none">
      {hasDiscount && (
        <Badge
          variant="destructive"
          className="absolute left-4 top-4 z-10 rounded-md px-2.5 py-1 text-sm"
        >
          -{discount}%
        </Badge>
      )}

      {}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-3">
        <Button variant="outline" size="icon" aria-label="Add to wishlist" className={iconBtn}>
          <Heart className="size-5" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Compare" className={iconBtn}>
          <RefreshCw className="size-5" />
        </Button>
        <Link
          href={`/products/${product._id}`}
          aria-label="View product"
          className={cn(buttonVariants({ variant: "outline", size: "icon" }), iconBtn)}
        >
          <Eye className="size-5" />
        </Link>
      </div>

      <Link href={`/products/${product._id}`} className="block bg-white p-4">
        <Image
          src={product.imageCover}
          alt={product.title}
          width={300}
          height={300}
          className="h-[300px] w-full object-contain"
        />
      </Link>

      <div className="flex flex-col gap-2 p-6">
        <span className="text-sm text-slate-500">{product.category.name}</span>
        <Link
          href={`/products/${product._id}`}
          className="line-clamp-1 text-lg text-slate-900 hover:text-green-600"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-5 text-yellow-400",
                  i < stars && "fill-yellow-400"
                )}
              />
            ))}
          </div>
          {product.ratingsAverage} ({product.ratingsQuantity})
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900">{finalPrice} EGP</span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {product.price} EGP
              </span>
            )}
          </div>
        <Button
  size="icon"
  aria-label="Add to cart"
  onClick={handleAdd}
  disabled={adding}
  className="size-14 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
>
  {adding ? (
    <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : (
    <Plus className="size-6" />
  )}
</Button>
        </div>
      </div>
    </Card>
  );
}
