import Link from "next/link";
import Image from "next/image";
import { getBrands } from "@/lib/api";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">All Brands</h1>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <Link
            key={b._id}
            href={`/brands/${b._id}`}
            className="rounded-xl border p-4 text-center transition hover:shadow-lg"
          >
            <Image
              src={b.image}
              alt={b.name}
              width={200}
              height={128}
              className="mx-auto h-32 w-auto object-contain"
            />
            <p className="mt-3 font-medium">{b.name}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}