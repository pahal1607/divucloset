import { supabase } from "./supabaseClient";
import { toError } from "./errorUtils";

export async function getMyProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw toError(error);
  return data;
}

export async function ensureMyProfile(profile: {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      [
        {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          role: "customer",
        },
      ],
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}

export async function updateMyProfile(
  userId: string,
  updates: { full_name?: string; phone?: string }
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}