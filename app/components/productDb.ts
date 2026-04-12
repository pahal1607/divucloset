import { supabase } from "./supabaseClient";
import { toError } from "./errorUtils";

export type ProductSizes = {
  S: number;
  M: number;
  L: number;
  XL: number;
};

export type DbProduct = {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  sizes?: ProductSizes;
};

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw toError(error);
  return data;
}

export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw toError(error);
  return data;
}

export async function addProduct(product: DbProduct) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();

  if (error) throw toError(error);
  return data;
}

export async function updateProduct(
  id: number,
  product: Omit<DbProduct, "id">
) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw toError(error);
}

export async function updateProductSizes(id: number, sizes: ProductSizes) {
  const { data, error } = await supabase
    .from("products")
    .update({ sizes })
    .eq("id", id)
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}