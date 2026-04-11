"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { createClient } from "./supabaseBrowser";

const ADMIN_EMAIL = "keertidwivedi2008@gmail.com";

export default function SiteHeader() {
  const supabase = createClient();

  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const data = localStorage.getItem("divucloset-cart");
      const cart = data ? JSON.parse(data) : [];
      const total = cart.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(total);
    };

    const updateUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setLoggedIn(!!user);
      setIsAdmin(
        !!user &&
          user.email?.toLowerCase().trim() === ADMIN_EMAIL
      );
    };

    updateCart();
    updateUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      updateUser();
    });

    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("storage", updateCart);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="block">
          <h1 className="text-2xl font-bold tracking-[0.25em] text-white">
            DIVUCLOSET
          </h1>
          <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-500">
            Premium E-commerce
          </p>
        </Link>

        <div className="hidden flex-1 lg:block lg:max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-full border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none"
            />
          </div>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/women" className="text-zinc-300 hover:text-white">
            Women
          </Link>
          <Link href="/men" className="text-zinc-300 hover:text-white">
            Men
          </Link>
          <Link href="/shoes" className="text-zinc-300 hover:text-white">
            Shoes
          </Link>
          <Link href="/beauty-products" className="text-zinc-300 hover:text-white">
            Beauty
          </Link>
          <Link href="/jewelry" className="text-zinc-300 hover:text-white">
            Jewelry
          </Link>
          <Link href="/track" className="text-zinc-300 hover:text-white">
  Track
</Link>

          {isAdmin && (
            <Link href="/admin" className="font-semibold text-white hover:text-zinc-300">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={loggedIn ? "/account" : "/login"}
            className="text-zinc-300 hover:text-white"
          >
            👤
          </Link>

          <Link href="/cart" className="relative text-zinc-300 hover:text-white">
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="px-6 pb-4 lg:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none"
          />
        </div>

        <nav className="mt-4 flex flex-wrap gap-4">
          <Link href="/women">Women</Link>
          <Link href="/men">Men</Link>
          <Link href="/shoes">Shoes</Link>
          <Link href="/beauty-products">Beauty</Link>
          <Link href="/jewelry">Jewelry</Link>
          <Link href="/track">Track</Link>
          {isAdmin && <Link href="/admin">Admin</Link>}
        </nav>
      </div>
    </header>
  );
}