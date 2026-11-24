import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/api";

export default async function CategorySection() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-6">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-4xl font-bold text-slate-900">
          <span className="h-10 w-1.5 rounded-full bg-green-600" />
          Shop By <span className="text-green-600">Category</span>
        </h2>
        <Link
          href="/categories"
          className="flex items-center gap-2 text-lg font-medium text-green-600 hover:text-green-700"
        >
          View All Categories <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/categories/${cat._id}`}
            className="flex flex-col items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full object-cover"
            />
            <span className="text-lg text-slate-700">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}