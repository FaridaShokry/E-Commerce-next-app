"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  label: string;
  href: string;
}

export default function CategoriesDropdown({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        href="/categories"
        onClick={() => setOpen(false)}
        className={cn("flex items-center gap-1 transition", open && "text-green-600")}
      >
        Categories
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </Link>

      <div
        className={cn(
          "absolute left-0 top-full z-50 pt-4 transition",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <ul className="w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)} // close the menu after choosing
                className="block rounded-xl px-4 py-3 text-slate-600 transition hover:bg-green-50 hover:text-green-600"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}