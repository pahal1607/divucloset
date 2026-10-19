"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatPrice } from "../lib/product-utils";

type Suggestion = {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  href: string;
};

export default function SearchBox({
  autoFocus = false,
  variant = "dropdown",
  onNavigate,
  initialValue = "",
  placeholder = "Search sarees, tops, shirts…",
}: {
  autoFocus?: boolean;
  /** "dropdown" floats under the input (desktop header); "inline" flows below it (mobile). */
  variant?: "dropdown" | "inline";
  onNavigate?: () => void;
  initialValue?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(initialValue);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const term = q.trim();
  const active = term.length >= 2;

  // Fetch a handful of suggestions as the person types (instead of downloading
  // the whole catalogue on every page, like the old header did).
  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        setItems(json.results ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setItems([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, active]);

  useEffect(() => {
    if (variant !== "dropdown") return;
    const onPointerDown = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [variant]);

  const go = (event: React.FormEvent) => {
    event.preventDefault();
    if (!term) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const showPanel = active && (variant === "inline" || open);

  const panel = (
    <div
      className={
        variant === "dropdown"
          ? "absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
          : "mt-3 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
      }
    >
      {loading && items.length === 0 ? (
        <p className="p-4 text-sm text-zinc-400">Searching…</p>
      ) : items.length === 0 ? (
        <p className="p-4 text-sm text-zinc-400">No matching products.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5"
              >
                <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                  <ProductImage src={item.image_url} alt={item.name} sizes="40px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {item.name}
                  </span>
                  <span className="block truncate text-xs text-zinc-500">
                    {item.category}
                  </span>
                </span>
                <span className="text-sm font-semibold text-gold-soft">
                  {formatPrice(item.price)}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="submit"
              className="w-full border-t border-white/10 px-4 py-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-white/5"
            >
              See all results for “{term}”
            </button>
          </li>
        </ul>
      )}
    </div>
  );

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={go} role="search">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="search"
            name="q"
            value={q}
            autoFocus={autoFocus}
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Search products"
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            // 16px font prevents iOS from zooming the page when the field is focused.
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-gold/60 focus:bg-white/10"
          />
          {q && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQ("");
                setItems([]);
              }}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {showPanel && panel}
      </form>
    </div>
  );
}
