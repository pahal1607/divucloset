"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { createClient } from "./supabaseBrowser";
import { getProducts } from "./productDb";

const ADMIN_EMAIL = "keertidwivedi2008@gmail.com";

export default function SiteHeader() {
  const supabase = createClient();

  const [cartCount, setCartCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingSuggestions(true);
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load search suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const filteredSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return products
      .filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();
        const description = String(product.description || "").toLowerCase();

        return (
          name.includes(q) ||
          category.includes(q) ||
          description.includes(q)
        );
      })
      .slice(0, 5);
  }, [products, search]);

  const getProductHref = (product: any) => {
    const slug = String(product.category || "")
      .toLowerCase()
      .replace(/ /g, "-");
    return `/${slug}/${product.id}`;
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = search.trim();
    if (!value) return;
    setShowSuggestions(false);
    closeMobile();
    window.location.href = `/search?q=${encodeURIComponent(value)}`;
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

        <div ref={searchBoxRef} className="hidden flex-1 lg:block lg:max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              name="q"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for products..."
              className="w-full rounded-full border border-white/10 bg-zinc-950 py-3 pl-11 pr-14 text-sm text-white outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200"
            >
              Go
            </button>

            {showSuggestions && search.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
                {loadingSuggestions ? (
                  <div className="p-4 text-sm text-zinc-400">
                    Loading suggestions...
                  </div>
                ) : filteredSuggestions.length === 0 ? (
                  <div className="p-4 text-sm text-zinc-400">
                    No matching products
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredSuggestions.map((product) => (
                      <Link
                        key={product.id}
                        href={getProductHref(product)}
                        onClick={() => setShowSuggestions(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-black"
                      >
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-[10px] text-zinc-500">
                            No Image
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-zinc-400">
                            {product.category}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-white">
                          ₹{product.price}
                        </p>
                      </Link>
                    ))}

                    <button
                      type="submit"
                      className="w-full border-t border-white/10 px-4 py-3 text-left text-sm font-medium text-zinc-300 hover:bg-black"
                    >
                      View all results for "{search.trim()}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
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

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg border border-white/10 p-2 text-white lg:hidden"
            aria-label="Toggle menu"
            type="button"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 lg:hidden">
        <div ref={searchBoxRef} className="relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              name="q"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search"
              className="w-full rounded-full border border-white/10 bg-zinc-950 py-3 pl-11 pr-16 text-sm text-white outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black"
            >
              Go
            </button>
          </form>

          {showSuggestions && search.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
              {loadingSuggestions ? (
                <div className="p-4 text-sm text-zinc-400">
                  Loading suggestions...
                </div>
              ) : filteredSuggestions.length === 0 ? (
                <div className="p-4 text-sm text-zinc-400">
                  No matching products
                </div>
              ) : (
                <div className="py-2">
                  {filteredSuggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={getProductHref(product)}
                      onClick={() => {
                        setShowSuggestions(false);
                        closeMobile();
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-black"
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-[10px] text-zinc-500">
                          No Image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {product.name}
                        </p>
                        <p className="truncate text-xs text-zinc-400">
                          {product.category}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-white">
                        ₹{product.price}
                      </p>
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const value = search.trim();
                      if (!value) return;
                      setShowSuggestions(false);
                      closeMobile();
                      window.location.href = `/search?q=${encodeURIComponent(value)}`;
                    }}
                    className="w-full border-t border-white/10 px-4 py-3 text-left text-sm font-medium text-zinc-300 hover:bg-black"
                  >
                    View all results for "{search.trim()}"
                  </button>
                </div>
              )}
            </div>
          )}
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