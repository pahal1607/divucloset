import type { Metadata } from "next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "Online Fashion Store for Women, Men, Shoes & Beauty",
  description:
    "Shop premium fashion online at DivuCloset. Explore women’s wear, men’s clothing, shoes, jewelry, and beauty products with a stylish shopping experience.",
  alternates: {
    canonical: "/",
  },
};

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

async function getProducts() {
  const supabase = await getSupabase();

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  return data || [];
}

export default async function Page() {
  const products = await getProducts();

  return <HomeClient initialProducts={products} />;
}