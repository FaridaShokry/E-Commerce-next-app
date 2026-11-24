import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FolderOpen } from "lucide-react";

import { getCategory, getCategorySubCategories } from "@/lib/api";

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, subCategories] = await Promise.all([
    getCategory(id),
    getCategorySubCategories(id),
  ]);

  return (
    <>
     
      <main>
        <section className="bg-gradient-to-br from-green-600 to-green-400 text-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <nav className="mb-6 text-lg text-green-50">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-3 opacity-70">/</span>
              <Link href="/categories" className="hover:underline">Categories</Link>
              <span className="mx-3 opacity-70">/</span>
              <span className="font-medium text-white">{category.name}</span>
            </nav>

            <div className="flex items-center gap-5">
              <span className="rounded-2xl bg-white/20 p-3 shadow-lg">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={50}
                  height={68}
                  className="h-[68px] w-[50px] rounded-md object-cover"
                />
              </span>
              <div>
                <h1 className="text-5xl font-bold">{category.name}</h1>
                <p className="mt-1 text-xl text-green-50">
                  Choose a subcategory to browse products
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-3 text-lg text-slate-600 transition hover:text-green-600"
          >
            <ArrowLeft size={22} /> Back to Categories
          </Link>

          <h2 className="mb-8 mt-8 text-2xl font-semibold text-slate-900">
            {subCategories.length} Subcategories in {category.name}
          </h2>

          {subCategories.length === 0 ? (
            <p className="text-slate-500">No subcategories in this category yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {subCategories.map((sub) => (
                <div
                  key={sub._id}
                  className="flex min-h-[245px] flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <FolderOpen size={32} fill="currentColor" />
                  </span>
                  <h3 className="text-2xl font-semibold text-slate-900">{sub.name}</h3>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}