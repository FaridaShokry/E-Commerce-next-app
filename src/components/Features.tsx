import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP", color: "bg-blue-50 text-blue-500" },
  { icon: ShieldCheck, title: "Secure Payment", text: "100% secure transactions", color: "bg-green-50 text-green-600" },
  { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy", color: "bg-orange-50 text-orange-500" },
  { icon: Headphones, title: "24/7 Support", text: "Dedicated support team", color: "bg-purple-50 text-purple-500" },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-11">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text, color }) => (
          <div key={title} className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <span className={`rounded-full p-4 ${color}`}><Icon size={22} /></span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}