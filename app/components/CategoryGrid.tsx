"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import type { Product } from "../lib/product-utils";

type Sort = "new" | "low" | "high";

/** Filter chips + sorting. The full list is still in the server-rendered HTML,
 *  so Google sees every product even before this component runs. */
export default function CategoryGrid({ products }: { products: Product[] }) {
  const [sub, setSub] = useState("All");
  const [sort, setSort] = useState<Sort>("new");

  const subcategories = useMemo(() => {
    const unique = new Set(
      products.map((p) => String(p.subcategory || "").trim()).filter(Boolean)
    );
    return ["All", ...Array.from(unique)];
  }, [products]);

  const list = useMemo(() => {
    const filtered =
      sub === "All"
        ? [...products]
        : products.filter(
            (p) => String(p.subcategory || "").trim().toLowerCase() === sub.toLowerCase()
          );
    if (sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, sub, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {subcategories.length > 1 ? (
          <div
            role="group"
            aria-label="Filter by type"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {subcategories.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={sub === s}
                onClick={() => setSub(s)}
                className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-medium transition ${
                  sub === s
                    ? "bg-white text-black"
                    : "border border-white/15 text-zinc-200 hover:border-gold hover:text-gold"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm text-zinc-500">
            {list.length} {list.length === 1 ? "style" : "styles"}
          </p>
          <label className="sr-only" htmlFor="sort">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-h-11 rounded-full border border-white/15 bg-zinc-950 px-4 text-base text-zinc-200 outline-none focus:border-gold sm:text-sm"
          >
            <option value="new">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {list.map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 0.05} className="h-full">
            <ProductCard product={product} headingLevel={2} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
