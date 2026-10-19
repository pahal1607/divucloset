import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { categories } from "../lib/categories";
import { searchProducts } from "../lib/product-data";

// Search results are thin, duplicate-prone pages — keep them out of Google.
export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 80);
  const results = query.length >= 2 ? await searchProducts(query, 60) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        {query ? `Results for “${query}”` : "Search"}
      </h1>

      {/* Plain GET form: works instantly, even before JavaScript loads. */}
      <form action="/search" method="get" role="search" className="mt-6 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            autoFocus={!query}
            placeholder="Search sarees, tops, shirts…"
            aria-label="Search products"
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-24 text-base text-white outline-none placeholder:text-zinc-500 focus:border-gold/60"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <p className="mt-5 text-zinc-400">
          {results.length > 0
            ? `${results.length} ${results.length === 1 ? "product" : "products"} found.`
            : query.length < 2
              ? "Type at least 2 characters."
              : "No matching products found."}
        </p>
      )}

      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} headingLevel={2} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-sm text-zinc-500">Or browse a category:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-200 transition hover:border-gold hover:text-gold"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
