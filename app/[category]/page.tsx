import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MessageCircle } from "lucide-react";
import CategoryGrid from "../components/CategoryGrid";
import JsonLd from "../components/JsonLd";
import { categories, getCategory } from "../lib/categories";
import { getProductsByCategory } from "../lib/product-data";
import { isHttpUrl, productPath } from "../lib/product-utils";
import { siteConfig, whatsappLink } from "../lib/site";

export const revalidate = 300;
// Only the five real categories exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cfg = getCategory(category);
  if (!cfg) return {};

  const products = await getProductsByCategory(cfg.slug);
  const cover = products.map((p) => p.image_url).find(isHttpUrl);
  const url = `/${cfg.slug}`;

  return {
    title: cfg.title,
    description: cfg.description,
    alternates: { canonical: url },
    // An empty category is a thin page — keep it out of Google until it has products.
    robots: products.length > 0 ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      url,
      title: cfg.title,
      description: cfg.description,
      // Fall back to the site's default share image when no product photo is available.
      images: [{ url: cover ?? "/opengraph-image" }],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cfg = getCategory(category);
  if (!cfg) notFound();

  const products = await getProductsByCategory(cfg.slug);
  const pageUrl = `${siteConfig.url}/${cfg.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: cfg.label, item: pageUrl },
    ],
  };

  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cfg.h1,
    url: pageUrl,
    description: cfg.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 30).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteConfig.url}${productPath(p)}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-white">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <li aria-current="page" className="text-zinc-300">
            {cfg.label}
          </li>
        </ol>
      </nav>

      <header className="mt-5 max-w-3xl animate-fade-up">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Collection</p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
          {cfg.h1}
        </h1>
        <p className="mt-4 leading-7 text-zinc-400">{cfg.intro}</p>
      </header>

      <div className="mt-8">
        {products.length > 0 ? (
          <CategoryGrid products={products} />
        ) : (
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-semibold">New styles arriving soon</h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              We&apos;re still adding {cfg.label.toLowerCase()} to the store. Browse another
              category, or message us and we&apos;ll tell you what&apos;s coming.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {categories
                .filter((c) => c.slug !== cfg.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-200 transition hover:border-gold hover:text-gold"
                  >
                    {c.label}
                  </Link>
                ))}
              <a
                href={whatsappLink(`Hi DivuCloset, when will you add ${cfg.label.toLowerCase()}?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-black"
              >
                <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      <JsonLd data={breadcrumbLd} />
      {products.length > 0 && <JsonLd data={listLd} />}
    </div>
  );
}
