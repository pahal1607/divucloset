"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "./components/productDb";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  sizes?: {
    S?: number;
    M?: number;
    L?: number;
    XL?: number;
  };
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const heroImages = useMemo(() => {
    return products.filter((p) => p.image_url).slice(0, 4);
  }, [products]);

  const latestProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => {
    const sizes = product.sizes || {};
    return (
      sum +
      Number(sizes.S || 0) +
      Number(sizes.M || 0) +
      Number(sizes.L || 0) +
      Number(sizes.XL || 0)
    );
  }, 0);

  const categoriesCount = new Set(products.map((p) => p.category)).size;

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-xs uppercase tracking-[0.35em] text-zinc-300">
              Best dark premium design for DivuCloset
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-6xl">
              Shop fashion that
              <br />
              feels <span className="text-zinc-400">luxurious</span>,
              <br />
              modern and bold.
            </h1>

            <p className="mt-6 max-w-xl text-base text-zinc-400 sm:text-lg">
              Real products from your admin panel now appear on the homepage too.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/women"
                className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
              >
                Shop Now
              </Link>

              <Link
                href="/contact-us"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white hover:text-black"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-3xl font-bold">{totalStock}+</p>
                <p className="mt-2 text-sm text-zinc-400">Items In Stock</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-3xl font-bold">{totalProducts}+</p>
                <p className="mt-2 text-sm text-zinc-400">Products Listed</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-3xl font-bold">{categoriesCount}+</p>
                <p className="mt-2 text-sm text-zinc-400">Categories</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-3xl font-bold">24/7</p>
                <p className="mt-2 text-sm text-zinc-400">Store Active</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {heroImages[0]?.image_url ? (
                <img
                  src={heroImages[0].image_url}
                  alt={heroImages[0].name}
                  className="h-56 w-full rounded-[2rem] object-cover sm:h-72"
                />
              ) : (
                <div className="h-56 w-full rounded-[2rem] bg-zinc-900 sm:h-72" />
              )}

              {heroImages[1]?.image_url ? (
                <img
                  src={heroImages[1].image_url}
                  alt={heroImages[1].name}
                  className="h-56 w-full rounded-[2rem] object-cover sm:h-72"
                />
              ) : (
                <div className="h-56 w-full rounded-[2rem] bg-zinc-900 sm:h-72" />
              )}
            </div>

            <div className="space-y-4 pt-8 sm:pt-12">
              {heroImages[2]?.image_url ? (
                <img
                  src={heroImages[2].image_url}
                  alt={heroImages[2].name}
                  className="h-56 w-full rounded-[2rem] object-cover sm:h-72"
                />
              ) : (
                <div className="h-56 w-full rounded-[2rem] bg-zinc-900 sm:h-72" />
              )}

              <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                  Featured Offer
                </p>
                <h3 className="mt-4 text-3xl font-bold">Fresh Admin Products</h3>
                <p className="mt-4 text-zinc-400">
                  Products you add in admin now show across the store.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              Trending Now
            </p>
            <h2 className="mt-2 text-3xl font-bold">Featured Products</h2>
          </div>
          <Link
            href="/women"
            className="text-sm font-medium text-zinc-300 hover:text-white"
          >
            View More
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-zinc-400">Loading products...</p>
        ) : featuredProducts.length === 0 ? (
          <p className="mt-8 text-zinc-400">No products added yet.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${product.category.toLowerCase().replace(/ /g, "-")}/${product.id}`}
                className="group rounded-3xl border border-white/10 bg-zinc-950 p-4 transition hover:border-white/20"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-72 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
                    No Image
                  </div>
                )}

                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                  {product.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold group-hover:text-zinc-300">
                  {product.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                  {product.description || "Premium product from DivuCloset."}
                </p>
                <p className="mt-4 text-2xl font-bold">₹{product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              Latest From Admin
            </p>
            <h2 className="mt-2 text-3xl font-bold">Latest from your admin panel</h2>
          </div>
          <Link
            href="/admin"
            className="text-sm font-medium text-zinc-300 hover:text-white"
          >
            Open Admin
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-zinc-400">Loading products...</p>
        ) : latestProducts.length === 0 ? (
          <p className="mt-8 text-zinc-400">No products added from admin yet.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${product.category.toLowerCase().replace(/ /g, "-")}/${product.id}`}
                className="rounded-3xl border border-white/10 bg-black p-4 hover:border-white/20"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-64 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
                    No Image
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                  <p className="mt-2 text-sm text-zinc-400">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}