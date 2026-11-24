import Link from "next/link";
import { ShoppingBag, ChevronLeft, ChevronRight, Filter, Package, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import ProductCard from "@/components/ProductCard";
import {
  getProducts,
  getAllProducts,
  getCategory,
  type Product,
  type PageMetadata,
} from "@/lib/api";

export const metadata = { title: "Products | FreshCart" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page, category } = await searchParams;
  const current = Math.max(1, Number(page) || 1);

  let products: Product[] = [];
  let meta: PageMetadata | null = null;
  let categoryName = "";

  if (category) {
    // filtered by category: fetch everything, keep only this category's products
    const [all, cat] = await Promise.all([
      getAllProducts(),
      getCategory(category).catch(() => null),
    ]);
    products = all.filter((p) => p.category?._id === category);
    categoryName = cat?.name ?? "Selected category";
  } else {
    const res = await getProducts(current);
    products = res.products;
    meta = res.metadata;
  }

  return (
    <>
    
      <main>
        <section className="bg-gradient-to-br from-green-600 to-green-400 text-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <nav className="mb-6 text-lg text-green-50">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-3 opacity-70">/</span>
              {category ? (
                <>
                  <Link href="/products" className="hover:underline">Products</Link>
                  <span className="mx-3 opacity-70">/</span>
                  <span className="font-medium text-white">{categoryName}</span>
                </>
              ) : (
                <span className="font-medium text-white">Products</span>
              )}
            </nav>
            <div className="flex items-center gap-5">
              <span className="rounded-2xl bg-white/20 p-5 shadow-lg">
                <ShoppingBag size={40} />
              </span>
              <div>
                <h1 className="text-5xl font-bold">
                  {category ? categoryName : "All Products"}
                </h1>
                <p className="mt-1 text-xl text-green-50">
                  {category
                    ? `Browse products in ${categoryName}`
                    : "Explore our full range of products"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          {/* active filters */}
          {category && (
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-lg text-slate-600">
                <Filter className="size-5 fill-slate-600" />
                <span>Active Filters:</span>
                <span className="inline-flex items-center gap-3 rounded-full bg-green-100 px-5 py-2 font-medium text-green-700">
                  <Layers className="size-5" />
                  {categoryName}
                  <Link href="/products" aria-label="Remove filter" className="hover:text-green-900">
                    <X className="size-5" />
                  </Link>
                </span>
                <Link href="/products" className="underline hover:text-green-600">
                  Clear all
                </Link>
              </div>
              <p className="mt-6 text-lg text-slate-500">
                Showing {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            </div>
          )}

          {products.length === 0 ? (
            /* empty state */
            <div className="flex flex-col items-center py-20 text-center">
              <span className="flex size-28 items-center justify-center rounded-full bg-slate-100">
                <Package className="size-12 text-slate-400" />
              </span>
              <h2 className="mt-8 text-2xl font-bold text-slate-900">No Products Found</h2>
              <p className="mt-3 text-lg text-slate-500">
                No products match your current filters.
              </p>
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-8 h-14 rounded-xl bg-green-600 px-8 text-lg font-semibold text-white hover:bg-green-700"
                )}
              >
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* pagination (only for the unfiltered list) */}
          {meta && meta.numberOfPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-6">
              {current > 1 ? (
                <Link
                  href={`/products?page=${current - 1}`}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}
                >
                  <ChevronLeft className="size-4" /> Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-slate-600">
                Page {meta.currentPage} of {meta.numberOfPages}
              </span>
              {current < meta.numberOfPages ? (
                <Link
                  href={`/products?page=${current + 1}`}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full bg-green-600 text-white hover:bg-green-700"
                  )}
                >
                  Next <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}