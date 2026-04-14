import { createClient } from "./supabaseBrowser";

const supabase = createClient();

export type ProductRecord = {
  id?: number;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[];
  sizes?: Record<string, number>;
  created_at?: string;
};

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data as ProductRecord[];
}

export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ProductRecord;
}

export async function addProduct(payload: ProductRecord) {
  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data as ProductRecord;
}

export async function updateProduct(
  id: number,
  payload: Partial<ProductRecord>
) {
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ProductRecord;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateProductSizes(
  id: number,
  sizes: Record<string, number>
) {
  const { data, error } = await supabase
    .from("products")
    .update({ sizes })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ProductRecord;
}