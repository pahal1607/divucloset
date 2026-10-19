"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, LayoutGrid, Search, ShoppingBag, User, X } from "lucide-react";
import { useCartCount } from "./useCartCount";
import { useAuth } from "./useAuth";
import { categories } from "../lib/categories";

export default function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const { loggedIn, isAdmin } = useAuth();
  const [shopOpen, setShopOpen] = useState(false);

  // Product pages have their own sticky "Add to cart" bar, and checkout should be distraction-free.
  const segments = pathname.split("/").filter(Boolean);
  const onProductPage =
    segments.length === 2 && categories.some((c) => c.slug === segments[0]);
  if (onProductPage || pathname.startsWith("/checkout")) return null;

  const accountHref = loggedIn ? "/account" : "/login";

  const items = [
    { key: "home", label: "Home", href: "/", icon: Home, active: pathname === "/" },
    { key: "search", label: "Search", href: "/search", icon: Search, active: pathname.startsWith("/search") },
    { key: "cart", label: "Cart", href: "/cart", icon: ShoppingBag, active: pathname.startsWith("/cart"), badge: cartCount },
    { key: "account", label: loggedIn ? "Account" : "Login", href: accountHref, icon: User, active: pathname.startsWith("/account") || pathname.startsWith("/login") },
  ];

  const itemClass = (active: boolean) =>
    `relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition ${
      active ? "text-gold" : "text-zinc-400 active:text-white"
    }`;

  return (
    <>
      <AnimatePresence>
        {shopOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShopOpen(false)}
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Shop by category"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="pb-safe fixed inset-x-0 bottom-0 z-[60] rounded-t-3xl border-t border-white/10 bg-zinc-950 px-5 pb-8 pt-5 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold">Shop by category</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setShopOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    onClick={() => setShopOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-medium text-white active:bg-white/10"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-sm text-zinc-400">
                <Link href="/track" onClick={() => setShopOpen(false)}>Track order</Link>
                <Link href="/contact-us" onClick={() => setShopOpen(false)}>Contact us</Link>
                <Link href="/shipping-returns" onClick={() => setShopOpen(false)}>Shipping &amp; returns</Link>
                <Link href="/about" onClick={() => setShopOpen(false)}>About</Link>
                {isAdmin && <Link href="/admin" onClick={() => setShopOpen(false)}>Admin</Link>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        aria-label="Quick navigation"
        className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex max-w-md items-stretch">
          <Link href={items[0].href} className={itemClass(items[0].active)}>
            <Home className="h-5 w-5" />
            {items[0].label}
          </Link>

          <button
            type="button"
            onClick={() => setShopOpen(true)}
            className={itemClass(
              categories.some((c) => pathname.startsWith(`/${c.slug}`))
            )}
          >
            <LayoutGrid className="h-5 w-5" />
            Shop
          </button>

          {items.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.key} href={item.href} className={itemClass(item.active)}>
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {"badge" in item && item.badge ? (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
