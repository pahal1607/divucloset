"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Truck,
} from "lucide-react";
import ProductImage from "./ProductImage";
import { addToCart } from "./cartUtils";
import {
  discountPercent,
  formatPrice,
  getMrp,
  productImages,
  totalStock,
  type Product,
} from "../lib/product-utils";
import { siteConfig, whatsappLink } from "../lib/site";

type Toast = { message: string; type: "success" | "error" } | null;

function sizeLabelFor(product: Product) {
  const sub = String(product.subcategory || "").toLowerCase();
  const cat = String(product.category || "").toLowerCase();
  if (sub.includes("jean") || sub.includes("trouser") || sub.includes("pant")) return "Waist size";
  if (cat.includes("shoe")) return "Shoe size";
  return "Size";
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const gallery = useMemo(() => productImages(product), [product]);
  const sizes = useMemo(() => Object.entries(product.sizes || {}), [product]);
  const inStockSizes = sizes.filter(([, qty]) => Number(qty) > 0);

  // A single available size (e.g. "Free size") is selected automatically.
  const [selectedSize, setSelectedSize] = useState(
    inStockSizes.length === 1 ? inStockSizes[0][0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<Toast>(null);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const stock = totalStock(product);
  const selectedStock = selectedSize ? Number(product.sizes?.[selectedSize] || 0) : 0;
  const mrp = getMrp(product);
  const off = discountPercent(product);
  const sizeLabel = sizeLabelFor(product);
  const { policies } = siteConfig;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = (i + gallery.length) % gallery.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const increase = () => {
    if (!selectedSize) return setToast({ message: `Select a ${sizeLabel.toLowerCase()} first`, type: "error" });
    if (quantity >= selectedStock) return setToast({ message: "No more stock in this size", type: "error" });
    setQuantity((q) => q + 1);
  };

  /** Returns true when the item was added to the cart. */
  const add = () => {
    if (stock === 0) {
      setToast({ message: "This product is out of stock", type: "error" });
      return false;
    }
    if (!selectedSize) {
      setToast({ message: `Please select a ${sizeLabel.toLowerCase()} first`, type: "error" });
      return false;
    }
    if (selectedStock <= 0) {
      setToast({ message: "That size is out of stock", type: "error" });
      return false;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: gallery[index] || gallery[0] || "",
      size: selectedSize,
      quantity,
    });
    return true;
  };

  const handleAdd = () => {
    if (add()) setToast({ message: "Added to your cart", type: "success" });
  };

  const handleBuyNow = () => {
    if (add()) router.push("/checkout");
  };

  const soldOut = stock === 0;

  const ctas = (
    <>
      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut}
        className="min-h-12 flex-1 rounded-full bg-white px-6 text-base font-semibold text-black transition hover:bg-gold-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {soldOut ? "Sold out" : "Add to cart"}
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={soldOut}
        className="min-h-12 flex-1 rounded-full border border-gold px-6 text-base font-semibold text-gold transition hover:bg-gold hover:text-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Buy now
      </button>
    </>
  );

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            role="status"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className={`fixed left-1/2 top-20 z-[80] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl px-5 py-3 text-center text-sm font-medium shadow-2xl ${
              toast.type === "success" ? "bg-green-500 text-black" : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GALLERY */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
          >
            {gallery.length > 0 ? (
              gallery.map((src, i) => (
                <div key={src + i} className="relative aspect-[3/4] w-full shrink-0 snap-center">
                  <ProductImage
                    src={src}
                    alt={i === 0 ? product.name : `${product.name} – photo ${i + 1}`}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              ))
            ) : (
              <div className="relative aspect-[3/4] w-full shrink-0">
                <ProductImage src={null} alt={product.name} sizes="100vw" />
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => scrollTo(index - 1)}
                className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => scrollTo(index + 1)}
                className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden">
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {off > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black">
              {off}% off
            </span>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="no-scrollbar mt-3 hidden gap-3 overflow-x-auto md:flex">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  i === index ? "border-gold" : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                <ProductImage src={src} alt="" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
          {product.subcategory || product.category}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-semibold text-gold-soft">{formatPrice(product.price)}</span>
          {mrp && (
            <>
              <span className="text-lg text-zinc-500 line-through">{formatPrice(mrp)}</span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
                {off}% off
              </span>
            </>
          )}
        </div>

        {soldOut ? (
          <p className="mt-4 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-300">
            Out of stock
          </p>
        ) : stock <= 5 ? (
          <p className="mt-4 inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm text-yellow-300">
            Only {stock} left
          </p>
        ) : null}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{sizeLabel}</h2>
              {selectedSize && (
                <span className="text-xs text-zinc-500">
                  {selectedStock} available in {selectedSize}
                </span>
              )}
            </div>
            <div role="radiogroup" aria-label={sizeLabel} className="mt-3 flex flex-wrap gap-2.5">
              {sizes.map(([size, qty]) => {
                const out = Number(qty) <= 0;
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={out}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    className={`min-h-12 min-w-14 rounded-xl border px-4 text-sm font-medium transition ${
                      active
                        ? "border-gold bg-gold text-black"
                        : out
                          ? "cursor-not-allowed border-white/10 text-zinc-600 line-through"
                          : "border-white/20 text-white hover:border-gold"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <h2 className="text-sm font-semibold text-white">Quantity</h2>
          <div className="flex items-center rounded-full border border-white/15">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/5"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center font-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={increase}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/5"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop buttons (mobile uses the sticky bar below) */}
        <div className="mt-7 hidden gap-3 lg:flex">{ctas}</div>

        {/* Delivery */}
        <ul className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-zinc-950 p-5 text-sm">
          <li className="flex gap-3">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="text-zinc-300">
              Expected delivery in about {policies.deliveryDays} days across India.
            </span>
          </li>
          <li className="flex gap-3">
            <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="text-zinc-300">
              {policies.returnWindowDays}-day returns —{" "}
              <Link href="/shipping-returns" className="text-gold underline-offset-2 hover:underline">
                see policy
              </Link>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="text-zinc-300">
              Questions about this product?{" "}
              <a
                href={whatsappLink(`Hi DivuCloset, I have a question about: ${product.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-2 hover:underline"
              >
                Ask on WhatsApp
              </a>
              .
            </span>
          </li>
        </ul>

        {/* Description is always in the page (not hidden in a tab) so Google can read it. */}
        <section className="mt-8" aria-labelledby="desc-heading">
          <h2 id="desc-heading" className="font-display text-xl font-semibold">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-zinc-400">
            {product.description?.trim() ||
              `${product.name} from the ${product.subcategory || product.category} collection at ${siteConfig.name}.`}
          </p>
        </section>

        <details className="group mt-6 rounded-2xl border border-white/10 bg-zinc-950 open:pb-1">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 py-3 font-medium">
            Product details
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 px-5 pb-4 text-sm">
            <dt className="text-zinc-500">Category</dt>
            <dd className="text-zinc-300">{product.category}</dd>
            {product.subcategory && (
              <>
                <dt className="text-zinc-500">Type</dt>
                <dd className="text-zinc-300">{product.subcategory}</dd>
              </>
            )}
            <dt className="text-zinc-500">{sizeLabel}s in stock</dt>
            <dd className="text-zinc-300">
              {inStockSizes.map(([s]) => s).join(", ") || "None right now"}
            </dd>
            <dt className="text-zinc-500">Product code</dt>
            <dd className="text-zinc-300">DC-{product.id}</dd>
          </dl>
        </details>
      </div>

      {/* Sticky mobile bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3 pb-3">
          <div className="shrink-0 leading-tight">
            <p className="text-lg font-semibold text-gold-soft">{formatPrice(product.price)}</p>
            {mrp && <p className="text-xs text-zinc-500 line-through">{formatPrice(mrp)}</p>}
          </div>
          {ctas}
        </div>
      </div>
    </div>
  );
}
