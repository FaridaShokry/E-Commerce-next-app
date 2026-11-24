import Link from "next/link";
import {
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";


const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
    <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.7V13h2.7v8h3.1z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z"
    />
  </svg>
);

const perks = [
  { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", text: "100% secure checkout" },
  { icon: Headphones, title: "24/7 Support", text: "Contact us anytime" },
];

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Electronics", href: "/categories/6439d2d167d9aa4ca970649f" },
      { label: "Men's Fashion", href: "/categories/6439d5b90049ad0b52b90048" },
      { label: "Women's Fashion", href: "/categories/6439d58a0049ad0b52b9003f" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Order History", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Track Order", href: "/track" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socials = [
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "X (Twitter)", icon: XIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "YouTube", icon: YoutubeIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer>
      {}
      <div className="border-t border-emerald-100 bg-emerald-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Icon className="size-7" />
              </span>
              <div>
                <p className="text-lg font-semibold text-slate-900">{title}</p>
                <p className="text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          {}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-3xl font-bold text-slate-900"
            >
              <ShoppingCart className="size-8 text-green-600" />
              FreshCart
            </Link>
            <p className="mt-8 max-w-md text-lg leading-8 text-slate-300">
              FreshCart is your one-stop destination for quality products. From fashion
              to electronics, we bring you the best brands at competitive prices with a
              seamless shopping experience.
            </p>

            <ul className="mt-8 space-y-4 text-lg">
              <li className="flex items-center gap-4">
                <Phone className="size-5 text-green-500" /> +1 (800) 123-4567
              </li>
              <li className="flex items-center gap-4">
                <Mail className="size-5 text-green-500" /> support@freshcart.com
              </li>
              <li className="flex items-center gap-4">
                <MapPin className="size-5 text-green-500" /> 123 Commerce Street, New York, NY 10001
              </li>
            </ul>

            <div className="mt-8 flex gap-4">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-green-600 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xl font-semibold text-white">{col.title}</h3>
              <ul className="mt-8 space-y-5 text-md">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-green-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {}
        <div className="border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-6 text-center text-slate-400">
            © {new Date().getFullYear()} FreshCart. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}