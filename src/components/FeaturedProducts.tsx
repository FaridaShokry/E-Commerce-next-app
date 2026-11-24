import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export default async function FeaturedProducts() {
  const { products } = await getProducts(1);
  const featured = products.slice(0, 10);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-10 flex items-center gap-3 text-4xl font-bold text-slate-900">
        <span className="h-10 w-1.5 rounded-full bg-green-600" />
        Featured <span className="text-green-600">Products</span>
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {featured.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}