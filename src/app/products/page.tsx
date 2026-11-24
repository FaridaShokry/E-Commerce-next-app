import Link from "next/link";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProducts, getAllProducts, getCategory, type Product } from "@/lib/api";
import { cn } from "@/lib/utils";

export const metadata = { title: "All Products | FreshCart" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  let products: Product[];
  let numberOfPages = 1;
  let categoryName: string | null = null;

  if (category) {
    // Filtered by category (the Categories menu links use ?category=<id>)
    const [all, cat] = await Promise.all([
      getAllProducts(),
      getCategory(category).catch(() => null),
    ]);
    products = all.filter((p) => p.category._id === category);
    categoryName = cat?.name ?? products[0]?.category.name ?? null;
  } else {
    const res = await getProducts(pageNum);
    products = res.products;
    numberOfPages = res.metadata.numberOfPages;
  }

  const title = categoryName ?? "All Products";

  return (
    <main>
      <section className="bg-gradient-to-br from-green-600 to-green-400 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <nav className="mb-6 text-green-50">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2 opacity-70">/</span>
            {categoryName ? (
              <>
                <Link href="/products" className="hover:underline">All Products</Link>
                <span className="mx-2 opacity-70">/</span>
                <span className="font-medium text-white">{categoryName}</span>
              </>
            ) : (
              <span className="font-medium text-white">All Products</span>
            )}
          </nav>

          <div className="flex items-center gap-5">
            <span className="rounded-2xl bg-white/20 p-5 shadow-lg">
              <Package size={40} />
            </span>
            <div>
              <h1 className="text-5xl font-bold">{title}</h1>
              <p className="mt-1 text-xl text-green-50">
                {categoryName
                  ? `Browse products in ${categoryName}`
                  : "Browse our wide range of products"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {products.length === 0 ? (
          <p className="py-16 text-center text-lg text-slate-500">No products found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {numberOfPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            {pageNum > 1 && (
              <Link
                href={`/products?page=${pageNum - 1}`}
                aria-label="Previous page"
                className="flex size-11 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <ChevronLeft className="size-5" />
              </Link>
            )}

            {Array.from({ length: numberOfPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`/products?page=${n}`}
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl font-medium ring-1",
                  n === pageNum
                    ? "bg-green-600 text-white ring-green-600"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                )}
              >
                {n}
              </Link>
            ))}

            {pageNum < numberOfPages && (
              <Link
                href={`/products?page=${pageNum + 1}`}
                aria-label="Next page"
                className="flex size-11 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <ChevronRight className="size-5" />
              </Link>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}