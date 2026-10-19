import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import JsonLd from "../../components/JsonLd";
import ProductCard from "../../components/ProductCard";
import ProductDetailClient from "../../components/ProductDetailClient";
import Reveal from "../../components/Reveal";
import { getCategory } from "../../lib/categories";
import { getProductById, getProductsByCategory } from "../../lib/product-data";
import {
  categorySlug,
  formatPrice,
  idFromSlug,
  isHttpUrl,
  productImages,
  productPath,
  totalStock,
  type Product,
} from "../../lib/product-utils";
import { siteConfig } from "../../lib/site";

export const revalidate = 300;

// Product pages are built the first time someone visits them, then cached and
// refreshed every 5 minutes (so the build never needs the database).
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ category: string; slug: string }> };

async function load(params: Props["params"]) {
  const { category, slug } = await params;
  const id = idFromSlug(slug);
  if (id === null) return null;
  const product = await getProductById(id);
  if (!product) return null;
  return { product, requested: `/${category}/${slug}` };
}

function metaDescription(p: Product) {
  const lead = `Buy ${p.name} online at ${siteConfig.name} for ${formatPrice(p.price)}.`;
  const body = String(p.description || "").replace(/\s+/g, " ").trim();
  const text = body
    ? `${lead} ${body}`
    : `${lead} ${p.subcategory || p.category}, with delivery across India.`;
  return text.length > 158 ? `${text.slice(0, 155).replace(/\s+\S*$/, "")}…` : text;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  if (!found) return { title: "Product not found", robots: { index: false } };

  const { product } = found;
  const canonical = productPath(product);
  const images = productImages(product).filter(isHttpUrl);
  const description = metaDescription(product);
  const title = `${product.name} – Buy Online`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      url: canonical,
      title: product.name,
      description,
      images: images.length
        ? images.slice(0, 4).map((url) => ({ url }))
        : [{ url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [images[0] ?? "/opengraph-image"],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();

  const { product, requested } = found;
  const canonical = productPath(product);

  // Old links like /women/31 (or a wrong category) permanently redirect to the one canonical URL.
  if (requested !== canonical) permanentRedirect(canonical);

  const cfg = getCategory(categorySlug(product.category));
  const categoryName = cfg?.label ?? product.category;
  const categoryHref = `/${categorySlug(product.category)}`;
  const url = `${siteConfig.url}${canonical}`;
  const images = productImages(product).filter(isHttpUrl);

  const related = (await getProductsByCategory(categorySlug(product.category)))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description || undefined,
    image: images.length ? images : undefined,
    sku: String(product.id),
    category: product.subcategory || product.category,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: Number(product.price).toFixed(2),
      availability:
        totalStock(product) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${siteConfig.url}/#organization` },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: categoryName, item: `${siteConfig.url}${categoryHref}` },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-white">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <li>
            <Link href={categoryHref} className="hover:text-white">
              {categoryName}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <li aria-current="page" className="line-clamp-1 max-w-[16rem] text-zinc-300 sm:max-w-md">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="mt-16 sm:mt-24" aria-labelledby="related-heading">
          <Reveal>
            <h2 id="related-heading" className="font-display text-2xl font-bold sm:text-3xl">
              You may also like
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
    </div>
  );
}
