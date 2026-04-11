"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "./supabaseBrowser";

const ADMIN_EMAIL = "keertidwivedi2008@gmail.com";

export default function SiteHeader() {
  const supabase = createClient();
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      setIsAdmin(!!user && user.email?.toLowerCase().trim() === ADMIN_EMAIL);
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

  const closeMobile = () => setMobileOpen(false);

  const handleSearch = () => {
    const value = search.trim();
    if (!value) return;
    closeMobile();
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="min-w-0" onClick={closeMobile}>
          <h1 className="truncate text-xl font-bold tracking-[0.22em] text-white sm:text-2xl">
            DIVUCLOSET
          </h1>
          <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500 sm:text-[11px]">
            Premium E-commerce
          </p>
        </Link>

        <div className="hidden flex-1 lg:block lg:max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for products..."
              className="w-full rounded-full border border-white/10 bg-zinc-950 py-3 pl-11 pr-12 text-sm text-white outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200"
            >
              Go
            </button>
          </div>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/women" className="text-zinc-300 hover:text-white">Women</Link>
          <Link href="/men" className="text-zinc-300 hover:text-white">Men</Link>
          <Link href="/shoes" className="text-zinc-300 hover:text-white">Shoes</Link>
          <Link href="/beauty-products" className="text-zinc-300 hover:text-white">Beauty</Link>
          <Link href="/jewelry" className="text-zinc-300 hover:text-white">Jewelry</Link>
          <Link href="/track" className="text-zinc-300 hover:text-white">Track</Link>
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

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg border border-white/10 p-2 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 lg:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            className="w-full rounded-full border border-white/10 bg-zinc-950 py-3 pl-11 pr-16 text-sm text-white outline-none"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black"
          >
            Go
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-zinc-950 px-4 py-4 lg:hidden">
          <nav className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/women" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
              Women
            </Link>
            <Link href="/men" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
              Men
            </Link>
            <Link href="/shoes" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
              Shoes
            </Link>
            <Link href="/beauty-products" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
              Beauty
            </Link>
            <Link href="/jewelry" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
              Jewelry
            </Link>
            <Link href="/track" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
              Track
            </Link>
            <Link
              href={loggedIn ? "/account" : "/login"}
              onClick={closeMobile}
              className="rounded-xl border border-white/10 p-3"
            >
              {loggedIn ? "Account" : "Login"}
            </Link>
            <Link href="/cart" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
              Cart
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={closeMobile} className="rounded-xl border border-white/10 p-3">
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}