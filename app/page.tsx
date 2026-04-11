"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Star,
  MessageCircle,
  Heart,
  Truck,
  ShieldCheck,
  Sparkles,
  BadgePercent,
} from "lucide-react";
import { getProducts } from "./components/productDb";

const categoryData = [
  { name: "Women", emoji: "👗", href: "/women" },
  { name: "Men", emoji: "👔", href: "/men" },
  { name: "Shoes", emoji: "👟", href: "/shoes" },
  { name: "Beauty Products", emoji: "💄", href: "/beauty-products" },
  { name: "Jewelry", emoji: "💍", href: "/jewelry" },
];

const testimonials = [
  {
    name: "Aarohi",
    text: "Loved the premium dark theme. It feels stylish and modern.",
  },
  {
    name: "Ritika",
    text: "The layout looks like a real fashion shopping website.",
  },
  {
    name: "Karan",
    text: "Clean, bold, and easy to browse. Very good brand feel.",
  },
];

const features = [
  { icon: Truck, title: "Fast Delivery", text: "Quick shipping across cities." },
  { icon: ShieldCheck, title: "Secure Shopping", text: "Trusted checkout experience." },
  { icon: BadgePercent, title: "Best Offers", text: "Special deals across categories." },
  { icon: Sparkles, title: "Premium Style", text: "Luxury-inspired dark e-commerce look." },
];

function HomeProductCard({ product }: { product: any }) {
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
            <span className="text-lg font-bold text-white sm:text-xl">₹{product.price}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function HeroImageCard({
  product,
  heightClass,
}: {
  product?: any;
  heightClass: string;
}) {
  if (product?.image_url) {
    return (
      <div className={`overflow-hidden rounded-3xl bg-zinc-900 ${heightClass}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>
    );
  }

  return <div className={`rounded-3xl bg-zinc-900 ${heightClass}`} />;
}

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Women");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load home products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const heroProducts = useMemo(() => {
    return products.filter((p) => p.image_url).slice(0, 3);
  }, [products]);

  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);
  const trendingProducts = useMemo(() => {
    return products.length > 8 ? products.slice(8, 16) : products.slice(0, 8);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [products, activeCategory]);

  const totalStock = useMemo(() => {
    return products.reduce((sum, product) => {
      const sizes = product.sizes || {};
      return (
        sum +
        Number(sizes.S || 0) +
        Number(sizes.M || 0) +
        Number(sizes.L || 0) +
        Number(sizes.XL || 0)
      );
    }, 0);
  }, [products]);

  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category)).size || 5;

  const dynamicStats = [
    { value: `${totalStock || 25000}+`, label: "Clothes Sold" },
    { value: `${Math.max(totalProducts * 5, 12500)}+`, label: "Happy Customers" },
    { value: `${totalProducts || 250}+`, label: "Products Listed" },
    { value: `${Math.max(totalCategories * 36, 180)}+`, label: "Cities Delivered" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="relative z-10 flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-zinc-300 sm:text-xs sm:tracking-[0.3em]">
              Best dark premium design for DivuCloset
            </span>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Shop fashion that feels{" "}
              <span className="text-zinc-400">luxurious</span>, modern and bold.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base md:text-lg">
              Real products from your admin panel now appear on the homepage too.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/women"
                className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black hover:bg-zinc-200"
              >
                Shop Now
              </Link>
              <Link
                href="/contact-us"
                className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white hover:bg-white hover:text-black"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {dynamicStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
                >
                  <p className="text-xl font-bold sm:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs text-zinc-400 sm:text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <HeroImageCard product={heroProducts[0]} heightClass="h-56 sm:h-72 md:h-80" />
            <div className="mt-6 sm:mt-8">
              <HeroImageCard product={heroProducts[1]} heightClass="h-56 sm:h-72 md:h-80" />
            </div>
            <HeroImageCard product={heroProducts[2]} heightClass="h-44 sm:h-56" />
            <div className="flex h-44 flex-col justify-center rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:h-56 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 sm:text-xs">
                Featured Offer
              </p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">Fresh Admin Products</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Products you add in admin now show across the store.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Shop by Category</p>
          <h2 className="mt-2 text-3xl font-bold">Browse your main collections</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categoryData.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-left transition hover:-translate-y-1 hover:border-white/20"
            >
              <p className="text-3xl">{category.emoji}</p>
              <h3 className="mt-3 text-xl font-semibold">{category.name}</h3>
              <p className="mt-2 text-sm text-zinc-400">Go to collection</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Featured Products</p>
            <h2 className="mt-2 text-3xl font-bold">Latest from your admin panel</h2>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading products...</p>
          ) : featuredProducts.length === 0 ? (
            <p className="text-zinc-400">No products added yet. Add some from /admin.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Trending Now</p>
          <h2 className="mt-2 text-3xl font-bold">More real products</h2>
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading products...</p>
        ) : trendingProducts.length === 0 ? (
          <p className="text-zinc-400">No products available.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trendingProducts.map((product) => (
              <HomeProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-white/10 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-wrap gap-3">
            {categoryData.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                  activeCategory === category.name
                    ? "bg-white text-black"
                    : "border border-white/10 bg-transparent text-white hover:bg-white hover:text-black"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">{activeCategory}</p>
              <h2 className="mt-2 text-3xl font-bold">Products in this category</h2>
            </div>
            <p className="text-sm text-zinc-400">Showing {filteredProducts.length} products</p>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-zinc-400">No products found in this category.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Why customers choose us</p>
          <h2 className="mt-2 text-3xl font-bold">Extra homepage section for strong brand trust</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-white p-3 text-black">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold">What happy customers say</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-3xl border border-white/10 bg-black p-7"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-white text-white" />
                  ))}
                </div>
                <p className="text-zinc-300">“{item.text}”</p>
                <p className="mt-5 font-semibold text-white">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-14">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-zinc-950 to-black p-6 sm:p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Contact Us</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Need help with orders, products, or support?
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Add your real phone number, email, address, Instagram, and WhatsApp here.
          </p>
        </div>
      </section>

      <a
        href="https://wa.me/916392342474"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-black shadow-2xl transition hover:scale-105 sm:bottom-6 sm:right-6 sm:px-5"
      >
        <MessageCircle className="h-5 w-5" /> WhatsApp
      </a>
    </div>
  );
}