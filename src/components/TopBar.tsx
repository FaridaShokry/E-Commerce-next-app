import Link from "next/link";
import { Truck, Gift, Phone, Mail, User, UserPlus } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-white text-sm text-slate-600">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2">
            <Truck size={16} className="text-green-600" /> Free Shipping on Orders 500 EGP
          </span>
          <span className="hidden items-center gap-2 md:flex">
            <Gift size={16} className="text-green-600" /> New Arrivals Daily
          </span>
        </div>
        <div className="hidden items-center gap-6 lg:flex">
          <span className="flex items-center gap-2"><Phone size={16} /> +1 (800) 123-4567</span>
          <span className="flex items-center gap-2"><Mail size={16} /> support@freshcart.com</span>
          <span className="h-5 w-px bg-slate-200" />
          <Link href="/login" className="flex items-center gap-2 hover:text-green-600">
            <User size={16} /> Sign In
          </Link>
          <Link href="/register" className="flex items-center gap-2 hover:text-green-600">
            <UserPlus size={16} /> Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}