"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { getProducts } from "../components/productDb";

function SearchProductCard({ product }: { product: any }) {
  const slug = product.category.toLowerCase().replace(/ /g, "-");

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <Link href={`/${slug}/${product.id}`}>
        <div className="relative overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-56 w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105 sm:h-64"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center bg-zinc-900 text-zinc-500 sm:h-64">
              No Image
            </div>
          )}

          <button
            type="button"
            className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white sm:right-4 sm:top-4"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            {product.category}
          </p>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold text-white sm:text-lg">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
            <Star className="h-4 w-4 fill-white text-white" />
            <span>4.8</span>
            <span>(128)</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-lg font-bold text-white sm:text-xl">
              ₹{product.price}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function SearchClient({ q }: { q: string }) {
  const query = q.trim();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load search products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const lower = query.toLowerCase();
    if (!lower) return [];

    return products.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const category = String(product.category || "").toLowerCase();
      const description = String(product.description || "").toLowerCase();

      return (
        name.includes(lower) ||
        category.includes(lower) ||
        description.includes(lower)
      );
    });
  }, [products, query]);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          Search Results
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          {query ? `Results for "${query}"` : "Search products"}
        </h1>
        <p className="mt-3 text-zinc-400">
          {query
            ? `Found ${filteredProducts.length} matching product(s).`
            : "Type something in the search bar to find products."}
        </p>

        {loading ? (
          <p className="mt-8 text-zinc-400">Loading products...</p>
        ) : !query ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-6 text-zinc-400">
            Search by product name, category, or description.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-6 text-zinc-400">
            No matching products found.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <SearchProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}