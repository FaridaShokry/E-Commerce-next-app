import Link from "next/link";
import Image from "next/image";
import { Layers } from "lucide-react";

import { getCategories } from "@/lib/api";

export const metadata = { title: "All Categories | FreshCart" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
    
      <main>
        <section className="bg-gradient-to-br from-green-600 to-green-400 text-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <nav className="mb-6 text-green-50">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2 opacity-70">/</span>
              <span className="font-medium text-white">Categories</span>
            </nav>
            <div className="flex items-center gap-5">
              <span className="rounded-2xl bg-white/20 p-5 shadow-lg">
                <Layers size={40} />
              </span>
              <div>
                <h1 className="text-5xl font-bold">All Categories</h1>
                <p className="mt-1 text-xl text-green-50">
                  Browse our wide range of product categories
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat._id}`}
                className="flex flex-col items-center gap-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={254}
                  height={254}
                  className="aspect-square w-full rounded-xl object-cover"
                />
                <h2 className="text-xl font-semibold text-slate-900">{cat.name}</h2>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}