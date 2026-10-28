import type { MetadataRoute } from "next";
import { siteConfig, policyLinks } from "./lib/site";
import { categories } from "./lib/categories";
import { getAllProducts } from "./lib/product-data";
import { categorySlug, isHttpUrl, productImages, productPath } from "./lib/product-utils";

// Rebuilt at most every 10 minutes, so new products appear without a redeploy.
export const revalidate = 600;

/**
 * Next.js writes <loc> and <image:loc> into sitemap.xml exactly as given, with no
 * XML escaping. A raw "&" in an image URL (e.g. "?auto=format&fit=crop") therefore
 * makes the whole file invalid XML, and Google rejects the sitemap. So every URL
 * is normalised and escaped here before it is handed to Next.js.
 */
function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeImageUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || !isHttpUrl(raw.trim())) return null;
  try {
    return xmlEscape(new URL(raw.trim()).href);
  } catch {
    return null; // not a parseable URL — leave it out of the sitemap
  }
}

/** A bad created_at value would make Next.js throw while writing <lastmod>. */
function validDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const products = await getAllProducts();

  const latest = products
    .map((p) => validDate(p.created_at)?.getTime() ?? 0)
    .reduce((a, b) => Math.max(a, b), 0);
  const lastModified = latest ? new Date(latest) : new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: "daily", priority: 1 },
    // Empty categories are noindex, so they stay out of the sitemap until they have products.
    ...categories
      .filter((c) => products.some((p) => categorySlug(p.category) === c.slug))
      .map((c) => ({
      url: `${base}/${c.slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    {
      url: `${base}/contact-us`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    ...policyLinks.map((l) => ({
      url: `${base}${l.href}`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}${productPath(p)}`,
    lastModified: validDate(p.created_at) ?? lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: productImages(p)
      .map(safeImageUrl)
      .filter((u): u is string => !!u)
      .slice(0, 5),
  }));

  // Each URL may appear only once. Private pages (cart, checkout, account, admin,
  // login, orders, tracking, search, API) are never added here and are also
  // disallowed in robots.ts.
  const seen = new Set<string>();
  return [...staticPages, ...productPages].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
