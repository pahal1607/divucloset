"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white mt-10">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* LOGO */}
        <div>
          <h2 className="text-2xl font-bold tracking-[0.25em]">DIVUCLOSET</h2>
          <p className="mt-4 text-sm text-zinc-400">
            Premium fashion store for clothing, shoes, beauty products and jewelry.
          </p>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="font-semibold">Categories</h3>
          <div className="mt-4 space-y-2 text-sm text-zinc-400">
            <Link href="/women">Women</Link><br />
            <Link href="/men">Men</Link><br />
            <Link href="/shoes">Shoes</Link><br />
            <Link href="/beauty-products">Beauty</Link><br />
            <Link href="/jewelry">Jewelry</Link>
          </div>
        </div>

        {/* PAGES */}
        <div>
          <h3 className="font-semibold">Pages</h3>
          <div className="mt-4 space-y-2 text-sm text-zinc-400">
            <Link href="/">Home</Link><br />
            <Link href="/login">Login</Link><br />
            <Link href="/cart">Cart</Link><br />
            <Link href="/contact-us">Contact</Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-4 text-sm text-zinc-400 space-y-2">
            <p>📞 +91 98765 43210</p>
            <p>📧 hello@divucloset.com</p>
            <p>📍 Your City, India</p>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 text-center py-4 text-sm text-zinc-500">
        © 2026 DivuCloset. All rights reserved.
      </div>
    </footer>
  );
}