import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { categories } from "../lib/categories";
import { addressLine, policyLinks, siteConfig, whatsappLink } from "../lib/site";

export default function Footer() {
  const { contact } = siteConfig;

  return (
    <footer className="mt-16 border-t border-white/10 bg-black text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.2em] text-white">
            DIVUCLOSET
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-gold">
            by {siteConfig.owner}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
            {siteConfig.tagline}. Shop online from anywhere in India.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappLink("Hi DivuCloset, I need help with…")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white transition hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white transition hover:border-gold hover:text-gold"
            >
              Instagram
            </a>
          </div>
        </div>

        <nav aria-label="Shop">
          <h2 className="text-sm font-semibold text-white">Shop</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="transition hover:text-white">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help and company">
          <h2 className="text-sm font-semibold text-white">Help &amp; company</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/track" className="transition hover:text-white">
                Track your order
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="transition hover:text-white">
                Contact us
              </Link>
            </li>
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                {contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{addressLine}</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-zinc-500">Support hours: {contact.hours}</p>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
