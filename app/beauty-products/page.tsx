"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts } from "../components/productDb";

function ProductCard({ product }: { product: any }) {
  const slug = String(product.category || "")
    .toLowerCase()
    .replace(/ /g, "-");

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition hover:-translate-y-1 hover:border-white/20">
      <Link href={`/${slug}/${product.id}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="flex h-64 items-center justify-center bg-zinc-900 text-zinc-500">
            No Image
          </div>
        )}

        <div className="p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            {product.category}
            {product.subcategory ? ` / ${product.subcategory}` : ""}
          </p>

          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
            {product.description || "No description available"}
          </p>

          <p className="mt-3 text-xl font-bold text-white">₹{product.price}</p>
        </div>
      </Link>
    </div>
  );
}

export default function BeautyProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcategory, setActiveSubcategory] = useState("All");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        const beautyProducts = (data || []).filter(
          (item: any) =>
            String(item.category || "").toLowerCase() === "beauty products"
        );
        setProducts(beautyProducts);
      } catch (error) {
        console.error("Failed to load beauty products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const subcategories = useMemo(() => {
    const unique = new Set(
      products
        .map((item) => String(item.subcategory || "").trim())
        .filter(Boolean)
    );

    return ["All", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeSubcategory === "All") return products;
    return products.filter(
      (item) =>
        String(item.subcategory || "").toLowerCase() ===
        activeSubcategory.toLowerCase()
    );
  }, [products, activeSubcategory]);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          Beauty Products
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Beauty Collection</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Browse skincare, makeup, haircare, and more from your beauty collection.
        </p>

        {subcategories.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  activeSubcategory === sub
                    ? "bg-white text-black"
                    : "border border-white/10 bg-transparent text-white hover:bg-white hover:text-black"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="mt-10 text-zinc-400">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="mt-10 text-zinc-400">No products found.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}