"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabaseBrowser";

// Used only to decide whether to *show* the Admin link. Real protection must come
// from Supabase row-level security, not from this check.
const ADMIN_EMAIL = "keertidwivedi2008@gmail.com";

export function useAuth() {
  const [state, setState] = useState({ loggedIn: false, isAdmin: false });

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const update = async () => {
      // getSession reads the local session — no network round trip on every page.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      const email = session?.user?.email?.toLowerCase().trim();
      setState({ loggedIn: !!session?.user, isAdmin: email === ADMIN_EMAIL });
    };

    update();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      update();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
