import type { Metadata } from "next";
import { Camera, Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import JsonLd from "../components/JsonLd";
import { addressLine, siteConfig, whatsappLink } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact DivuCloset for order help, product questions and delivery updates. Message us on WhatsApp, email or call during support hours.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactUsPage() {
  const { contact } = siteConfig;

  const cards = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      note: "Fastest way to reach us",
      value: contact.phone,
      href: whatsappLink("Hi DivuCloset, I need help with…"),
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      note: "For support and queries",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Phone,
      title: "Phone",
      note: "Call during support hours",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Camera,
      title: "Instagram",
      note: "See new arrivals first",
      value: contact.instagramHandle,
      href: contact.instagram,
      external: true,
    },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact DivuCloset",
    url: `${siteConfig.url}/contact-us`,
    mainEntity: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="max-w-2xl animate-fade-up">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Contact</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">We&apos;d love to help you</h1>
        <p className="mt-4 leading-7 text-zinc-400">
          Questions about an order, a size, or a product? Reach out and we&apos;ll get back to you.
          WhatsApp is the quickest way.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {cards.map(({ icon: Icon, title, note, value, href, external }) => (
          <a
            key={title}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group rounded-2xl border border-white/10 bg-zinc-950 p-6 transition hover:-translate-y-1 hover:border-gold/40"
          >
            <Icon className="h-6 w-6 text-gold" />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{note}</p>
            <p className="mt-3 break-all text-sm font-medium text-white">{value}</p>
          </a>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <Clock3 className="h-6 w-6 text-gold" />
          <h2 className="mt-4 text-lg font-semibold">Support hours</h2>
          <p className="mt-3 text-sm text-zinc-300">{contact.hours}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <MapPin className="h-6 w-6 text-gold" />
          <h2 className="mt-4 text-lg font-semibold">Based in</h2>
          <p className="mt-3 text-sm text-zinc-300">{addressLine}</p>
        </div>
      </div>

      <JsonLd data={ld} />
    </div>
  );
}
