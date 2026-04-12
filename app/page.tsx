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
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { getProducts } from "./components/productDb";

/* ---------------- DATA ---------------- */

const categoryData = [
  { name: "Women", emoji: "👗", href: "/women" },
  { name: "Men", emoji: "👔", href: "/men" },
  { name: "Shoes", emoji: "👟", href: "/shoes" },
  { name: "Beauty Products", emoji: "💄", href: "/beauty-products" },
  { name: "Jewelry", emoji: "💍", href: "/jewelry" },
];

const testimonials = [
  { name: "Aarohi", text: "Loved the premium dark theme." },
  { name: "Ritika", text: "Feels like a real shopping site." },
  { name: "Karan", text: "Clean, bold, and modern." },
];

const features = [
  { icon: Truck, title: "Fast Delivery", text: "Quick shipping." },
  { icon: ShieldCheck, title: "Secure", text: "Safe checkout." },
  { icon: BadgePercent, title: "Best Offers", text: "Top deals." },
  { icon: Sparkles, title: "Premium Style", text: "Luxury UI." },
];

/* ---------------- CARD ---------------- */

function HomeProductCard({ product }: { product: any }) {
  const slug = product.category.toLowerCase().replace(/ /g, "-");

  const stock =
    (product.sizes?.S || 0) +
    (product.sizes?.M || 0) +
    (product.sizes?.L || 0) +
    (product.sizes?.XL || 0);

  const isLow = stock > 0 && stock <= 5;
  const isFast = stock > 5 && stock <= 12;

  const fakeMrp = product.price * 1.4;
  const discount = Math.round(((fakeMrp - product.price) / fakeMrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden"
    >
      <Link href={`/${slug}/${product.id}`}>
        <div className="relative">
          <img
            src={product.image_url || ""}
            className="h-56 w-full object-cover transition hover:scale-110"
          />

          {/* Discount */}
          <div className="absolute top-3 left-3 bg-white text-black px-3 py-1 text-xs rounded-full">
            {discount}% OFF
          </div>

          {/* Urgency */}
          {isLow && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-xs px-3 py-1 rounded-full animate-pulse">
              Only {stock} left
            </div>
          )}

          {isFast && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Flame className="h-3 w-3" /> Fast
            </div>
          )}

          <button className="absolute right-3 top-3 bg-black/70 p-2 rounded-full">
            <Heart size={16} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs text-zinc-400 uppercase">{product.category}</p>
          <h3 className="mt-2 font-semibold">{product.name}</h3>

          <div className="mt-2 flex gap-2 text-sm text-zinc-400">
            ⭐ 4.8
          </div>

          <div className="mt-3 flex gap-2">
            <span className="font-bold">₹{product.price}</span>
            <span className="line-through text-zinc-500">
              ₹{Math.round(fakeMrp)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ---------------- HERO IMAGE ---------------- */

function HeroImage({ product }: { product?: any }) {
  if (!product?.image_url)
    return <div className="bg-zinc-900 rounded-3xl h-64" />;

  return (
    <motion.img
      whileHover={{ scale: 1.05 }}
      src={product.image_url}
      className="rounded-3xl h-64 w-full object-cover"
    />
  );
}

/* ---------------- PAGE ---------------- */

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Women");

  useEffect(() => {
    getProducts().then((d) => setProducts(d || []));
  }, []);

  const hero = products.slice(0, 3);
  const featured = products.slice(0, 8);
  const trending = products.slice(8, 16);

  const filtered = useMemo(() => {
    return products.filter(
      (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [products, activeCategory]);

  return (
    <div className="bg-black text-white min-h-screen px-4 sm:px-6">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12 text-center"
      >
        <h1 className="text-4xl font-bold">DIVUCLOSET</h1>
        <p className="text-zinc-400 mt-2">Premium fashion store</p>
      </motion.div>

      {/* HERO IMAGES */}
      <div className="grid grid-cols-2 gap-4">
        <HeroImage product={hero[0]} />
        <HeroImage product={hero[1]} />
      </div>

      {/* CATEGORY */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {categoryData.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="bg-zinc-950 p-4 rounded-2xl text-center"
            >
              {c.emoji}
              <p className="mt-2">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Featured</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <HomeProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Trending</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => (
            <HomeProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="mt-16">
        <div className="flex gap-3 flex-wrap">
          {categoryData.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveCategory(c.name)}
              className={`px-4 py-2 rounded-full ${
                activeCategory === c.name
                  ? "bg-white text-black"
                  : "border border-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          {filtered.map((p) => (
            <HomeProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-6">Why us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-zinc-950 p-6 rounded-2xl">
                <Icon />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="text-sm text-zinc-400">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-6">Testimonials</h2>
        <div className="grid lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-zinc-950 p-6 rounded-2xl">
              ⭐⭐⭐⭐⭐
              <p className="mt-2">{t.text}</p>
              <p className="mt-4 font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/916392342474"
        className="fixed bottom-4 right-4 bg-green-500 px-4 py-3 rounded-full flex gap-2 items-center text-black font-semibold"
      >
        <MessageCircle size={18} /> WhatsApp
      </a>
    </div>
  );
}