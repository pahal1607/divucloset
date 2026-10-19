// Pure helpers — safe to import from both server and client components.

export type Product = {
  id: number;
  name: string;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  price: number;
  /** Optional. Only shown (as a strike-through price) when it is higher than `price`. */
  mrp?: number | null;
  image_url?: string | null;
  images?: string[] | null;
  sizes?: Record<string, number> | null;
  created_at?: string | null;
};

export function slugify(input: string) {
  return String(input || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** "Beauty Products" -> "beauty-products" (same rule the old site used) */
export function categorySlug(category?: string | null) {
  return slugify(category || "");
}

/** Canonical product URL: /women/maroon-silk-saree-31 */
export function productPath(product: Pick<Product, "id" | "name" | "category">) {
  const name = slugify(product.name);
  return `/${categorySlug(product.category)}/${name ? `${name}-` : ""}${product.id}`;
}

/** Works for both the new "maroon-silk-saree-31" and the old "31" URLs. */
export function idFromSlug(slug: string): number | null {
  const match = String(slug).match(/(?:^|-)(\d+)$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) ? id : null;
}

export function totalStock(product: Pick<Product, "sizes">) {
  return Object.values(product.sizes || {}).reduce(
    (sum, qty) => sum + Number(qty || 0),
    0
  );
}

export function formatPrice(value: number | string) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Real MRP only — returns null when no valid MRP is stored. */
export function getMrp(product: Pick<Product, "price" | "mrp">) {
  const mrp = Number(product.mrp || 0);
  const price = Number(product.price || 0);
  return mrp > price && price > 0 ? mrp : null;
}

export function discountPercent(product: Pick<Product, "price" | "mrp">) {
  const mrp = getMrp(product);
  if (!mrp) return 0;
  return Math.round(((mrp - Number(product.price)) / mrp) * 100);
}

export function productImages(product: Pick<Product, "image_url" | "images">) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.filter(Boolean);
  }
  return product.image_url ? [product.image_url] : [];
}

export function isHttpUrl(value?: string | null) {
  return !!value && /^https?:\/\//i.test(value);
}
