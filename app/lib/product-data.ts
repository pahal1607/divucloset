// Server-side product reads. Uses the public anon key with no cookies, so pages
// that call this can be cached (ISR) instead of being rendered per visitor.
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Product } from "./product-utils";
import { categorySlug } from "./product-utils";
import { SAMPLE_PRODUCTS } from "./sample-products";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const useSample = () => process.env.USE_SAMPLE_DATA === "1";

/** All products, newest first. Deduplicated within a single render. */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  if (useSample()) return [...SAMPLE_PRODUCTS].sort((a, b) => b.id - a.id);

  const client = db();
  if (!client) {
    console.warn("Supabase env vars are missing — no products loaded.");
    return [];
  }

  const { data, error } = await client
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  // Throwing keeps the previously cached page alive if Supabase hiccups.
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return (data ?? []) as Product[];
});

export async function getProductById(id: number): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => categorySlug(p.category) === slug);
}

/** Simple, safe text search over name, category, subcategory and description. */
export async function searchProducts(query: string, limit = 48): Promise<Product[]> {
  const q = query.trim().toLowerCase().slice(0, 80);
  if (q.length < 2) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const all = await getAllProducts();

  return all
    .filter((p) => {
      const haystack = [p.name, p.category, p.subcategory, p.description]
        .map((v) => String(v || "").toLowerCase())
        .join(" ");
      return words.every((w) => haystack.includes(w));
    })
    .slice(0, limit);
}
