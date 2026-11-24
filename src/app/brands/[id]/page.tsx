import Image from "next/image";
import { getBrand, getProductsByBrand } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function BrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [brand, products] = await Promise.all([getBrand(id), getProductsByBrand(id)]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Image src={brand.image} alt={brand.name} width={160} height={80} className="h-20 w-auto object-contain" />
        <h1 className="text-3xl font-bold">{brand.name}</h1>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products for this brand yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}