import Link from "next/link";
import { categories } from "./lib/categories";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:py-28">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 text-zinc-400">
        The link may be old, or the product may have sold out and been removed. Try one of these
        instead:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gold-soft"
        >
          Go to homepage
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-200 transition hover:border-gold hover:text-gold"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
