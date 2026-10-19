import { supabase } from "./supabaseClient";
import { toError } from "./errorUtils";

export async function getMyAddresses(userId: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw toError(error);
  return data;
}

export async function addAddress(address: {
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}) {
  const { data, error } = await supabase
    .from("addresses")
    .insert([address])
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}

export async function deleteAddress(id: number) {
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw toError(error);
}

export async function setDefaultAddress(userId: string, id: number) {
  const { error: resetError } = await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId);

  if (resetError) throw toError(resetError);

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw toError(error);
}