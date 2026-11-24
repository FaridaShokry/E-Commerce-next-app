"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Heart, Headset, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoriesDropdown from "@/components/CategoriesDropdown";

const categoryMenu = [
  { label: "All Categories", href: "/categories" },
  { label: "Electronics", href: "/products?category=6439d2d167d9aa4ca970649f" },
  { label: "Women's Fashion", href: "/products?category=6439d58a0049ad0b52b9003f" },
  { label: "Men's Fashion", href: "/products?category=6439d5b90049ad0b52b90048" },
  { label: "Beauty & Health", href: "/products?category=6439d30b67d9aa4ca97064b1" },
];

export default function Navbar() {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const { count } = useCart();

  function handleSignOut() {
    logout();
    router.push("/login");
  }

  return (
    <header className="relative z-40 border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-3xl font-bold text-slate-900">
          <ShoppingCart className="text-green-600" size={34} />
          FreshCart
        </Link>

        <div className="hidden flex-1 items-center rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-1.5 lg:flex">
          <Input
            type="text"
            placeholder="Search for products, brands and more..."
            className="h-10 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <Button
            size="icon"
            aria-label="Search"
            className="size-11 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            <Search className="size-5" />
          </Button>
        </div>

        <nav className="hidden items-center gap-8 text-lg text-slate-700 xl:flex">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <Link href="/products" className="hover:text-green-600">Shop</Link>

          <CategoriesDropdown items={categoryMenu} />

          <Link href="/brands" className="hover:text-green-600">Brands</Link>
        </nav>

        <div className="ml-auto flex items-center gap-6">
          <div className="hidden items-center gap-3 border-r border-slate-200 pr-6 xl:flex">
            <span className="rounded-full bg-green-50 p-3 text-green-600"><Headset size={20} /></span>
            <div className="text-sm leading-tight">
              <p className="text-slate-500">Support</p>
              <p className="font-medium text-slate-800">24/7 Help</p>
            </div>
          </div>

          <button aria-label="Wishlist" className="text-slate-600 hover:text-green-600">
            <Heart size={26} />
          </button>

          <Link href="/cart" aria-label="Cart" className="relative text-slate-700 hover:text-green-600">
            <ShoppingCart size={26} />
            {count > 0 && (
              <span className="absolute -right-2.5 -top-2.5 flex size-5 items-center justify-center rounded-full bg-green-600 text-xs font-medium text-white">
                {count}
              </span>
            )}
          </Link>

          {token ? (
            <>
              <span className="hidden text-base text-slate-700 xl:inline">
                Hi, {user?.name?.split(" ")[0]}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-6 text-base font-medium"
              >
                <LogOut className="size-5" /> Sign Out
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full bg-green-600 px-6 text-base font-medium text-white shadow hover:bg-green-700"
              )}
            >
              <User className="size-5" /> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}