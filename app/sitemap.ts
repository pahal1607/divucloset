import type { MetadataRoute } from "next";
import { siteConfig, policyLinks } from "./lib/site";
import { categories } from "./lib/categories";
import { getAllProducts } from "./lib/product-data";
import { categorySlug, isHttpUrl, productImages, productPath } from "./lib/product-utils";

// Rebuilt at most every 10 minutes, so new products appear without a redeploy.
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const products = await getAllProducts();

  const latest = products
    .map((p) => (p.created_at ? new Date(p.created_at).getTime() : 0))
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
    lastModified: p.created_at ? new Date(p.created_at) : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: productImages(p).filter(isHttpUrl).slice(0, 5),
  }));

  return [...staticPages, ...productPages];
}
