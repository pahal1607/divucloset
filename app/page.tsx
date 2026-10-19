import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  PackageCheck,
  Ruler,
  RotateCcw,
  Truck,
} from "lucide-react";
import ProductCard from "./components/ProductCard";
import ProductImage from "./components/ProductImage";
import Reveal from "./components/Reveal";
import { categories } from "./lib/categories";
import { getAllProducts } from "./lib/product-data";
import { categorySlug, productPath, type Product } from "./lib/product-utils";
import { siteConfig, whatsappLink } from "./lib/site";

// Re-generated in the background at most every 5 minutes, so new products appear
// automatically while visitors still get a fast, cached page.
export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "DivuCloset | Sarees, Women's & Men's Fashion Online in India",
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

function HeroTile({
  product,
  className,
  priority = false,
  delay = 0,
}: {
  product?: Product;
  className: string;
  priority?: boolean;
  delay?: number;
}) {
  if (!product) {
    return <div className={`rounded-2xl bg-zinc-900 ${className}`} />;
  }
  return (
    <Link
      href={productPath(product)}
      aria-label={product.name}
      style={{ animationDelay: `${delay}ms` }}
      className={`group relative block animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 ${className}`}
    >
      <ProductImage
        src={product.image_url}
        alt={product.name}
        priority={priority}
        sizes="(min-width: 1024px) 22vw, 45vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
        {product.name}
      </span>
    </Link>
  );
}

export default async function HomePage() {
  const products = await getAllProducts();
  const { policies, contact } = siteConfig;

  const withImages = products.filter((p) => p.image_url);
  const hero = withImages.slice(0, 3);
  const newArrivals = products.slice(0, 8);

  const shelves = categories
    .map((c) => ({
      ...c,
      items: products.filter((p) => categorySlug(p.category) === c.slug),
    }))
    .filter((c) => c.items.length > 0);

  const values = [
    {
      icon: Truck,
      title: `Delivery in about ${policies.deliveryDays} days`,
      text: "Shipped to your door anywhere in India.",
    },
    {
      icon: RotateCcw,
      title: `${policies.returnWindowDays}-day returns`,
      text: "Simple, clearly written return policy.",
    },
    {
      icon: Ruler,
      title: "Live size availability",
      text: "Every product shows exactly which sizes are in stock.",
    },
    {
      icon: MessageCircle,
      title: "Real help on WhatsApp",
      text: `Chat with us, ${contact.hours} IST.`,
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,180,131,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-20">
          <div className="animate-fade-up">
            <p className="mb-5 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:text-xs">
              Premium fashion store
            </p>

            <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              Shop fashion that feels{" "}
              <span className="text-gold">luxurious</span>, modern and bold.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Sarees, tops, kurti sets, men&apos;s shirts, shoes and jewelry —
              with clear prices and live size availability, shipped across
              India.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/women"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-black transition hover:bg-gold-soft"
              >
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink("Hi DivuCloset, I'd like some help choosing…")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gold" /> Delivery in about{" "}
                {policies.deliveryDays} days
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-gold" />{" "}
                {policies.returnWindowDays}-day returns
              </li>
              <li className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-gold" /> Pay easily by UPI
              </li>
            </ul>
          </div>

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            <HeroTile product={hero[0]} priority delay={100} className="aspect-[3/4]" />
            <div className="mt-8 sm:mt-10">
              <HeroTile product={hero[1]} priority delay={220} className="aspect-[3/4]" />
            </div>
            <HeroTile product={hero[2]} delay={340} className="aspect-[4/3]" />
            <Link
              href="/women"
              style={{ animationDelay: "460ms" }}
              className="group flex aspect-[4/3] animate-fade-up flex-col justify-between rounded-2xl border border-gold/30 bg-gradient-to-br from-zinc-900 to-black p-4 transition hover:border-gold sm:p-5"
            >
              <span className="text-[10px] uppercase tracking-[0.28em] text-gold">
                New arrivals
              </span>
              <span className="font-display text-lg leading-snug text-white sm:text-xl">
                Explore the latest styles
              </span>
              <ArrowRight className="h-5 w-5 text-gold transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      {shelves.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Shop by category</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Find your style
            </h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {shelves.map((c, i) => {
              const cover = c.items.find((p) => p.image_url);
              return (
                <Reveal key={c.slug} delay={i * 0.06}>
                  <Link
                    href={`/${c.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
                  >
                    {cover && (
                      <ProductImage
                        src={cover.image_url}
                        alt={`${c.label} collection`}
                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-4">
                      <span className="block font-display text-xl font-semibold text-white">
                        {c.label}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-zinc-300">
                        {c.items.length} {c.items.length === 1 ? "style" : "styles"}
                        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section id="new-arrivals" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Just in</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">New arrivals</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* PER-CATEGORY SHELVES (also gives Google strong internal links) */}
      {shelves.map((c) => (
        <section key={c.slug} className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Collection</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{c.label}</h2>
            </div>
            <Link
              href={`/${c.slug}`}
              className="flex shrink-0 items-center gap-1 pb-1 text-sm font-medium text-zinc-300 transition hover:text-gold"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {c.items.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      {/* WHY DIVUCLOSET */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Why DivuCloset</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Shopping that&apos;s simple and clear
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-gold/30">
                <Icon className="h-6 w-6 text-gold" />
                <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-400">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BRAND + CTA */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-7 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                  About DivuCloset
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                  DivuCloset is an online fashion store run by {siteConfig.owner} from{" "}
                  {contact.address.locality}, {contact.address.region}. We bring together
                  sarees, everyday tops, kurti sets, men&apos;s shirts, shoes, jewelry and
                  beauty picks, and we try to keep every listing honest: clear prices,
                  real sizes, and a person you can message if you need help.
                </p>
                <Link
                  href="/about"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline"
                >
                  Read our story <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <p className="font-display text-xl font-semibold">Need help choosing?</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Send us a message with what you&apos;re looking for and we&apos;ll point you to
                  the right piece.
                </p>
                <a
                  href={whatsappLink("Hi DivuCloset, I need help choosing…")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
