import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ProductDetailClient from "../../components/ProductDetailClient";
import { notFound } from "next/navigation";

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

async function getProduct(id: string) {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !data) return null;
  return data;
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <ProductDetailClient
      initialProduct={product}
      category={category}
      id={id}
    />
  );
}