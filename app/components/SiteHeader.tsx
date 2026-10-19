"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingBag, User, X } from "lucide-react";
import SearchBox from "./SearchBox";
import { useCartCount } from "./useCartCount";
import { useAuth } from "./useAuth";
import { categories } from "../lib/categories";

export default function SiteHeader() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const { loggedIn, isAdmin } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile search overlay is open.
  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-ink/90 backdrop-blur-xl"
          : "border-transparent bg-ink/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8">
        <Link href="/" aria-label="DivuCloset home" className="shrink-0 leading-none">
          <span className="block font-display text-xl font-bold tracking-[0.2em] text-white sm:text-2xl">
            DIVUCLOSET
          </span>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.34em] text-gold">
            by Divyanshi
          </span>
        </Link>

        <nav aria-label="Main" className="ml-2 hidden items-center gap-6 lg:flex">
          {categories.map((c) => {
            const active = pathname === `/${c.slug}` || pathname.startsWith(`/${c.slug}/`);
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className={`group relative py-2 text-sm font-medium transition ${
                  active ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {c.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden max-w-md flex-1 lg:block">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold lg:inline-block"
            >
              Admin
            </Link>
          )}

          <Link
            href={loggedIn ? "/account" : "/login"}
            aria-label={loggedIn ? "My account" : "Log in"}
            className="hidden h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white lg:flex"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="mobile-search"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-ink px-4 pt-4 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <SearchBox
                  autoFocus
                  variant="inline"
                  onNavigate={() => setSearchOpen(false)}
                />
              </div>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-zinc-300 hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Popular
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-zinc-200"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
