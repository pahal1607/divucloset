import "./globals.css";
import type { Metadata, Viewport } from "next";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import JsonLd from "./components/JsonLd";
import { siteConfig } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Sarees, Women's & Men's Fashion, Shoes, Jewelry`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} | Premium Fashion Store`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Premium Fashion Store`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  // Add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in your hosting env to verify the site
  // in Google Search Console without touching code.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/opengraph-image`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.contact.address.locality,
    addressRegion: siteConfig.contact.address.region,
    postalCode: siteConfig.contact.address.postalCode,
    addressCountry: siteConfig.contact.address.country,
  },
  sameAs: [siteConfig.contact.instagram],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  inLanguage: "en-IN",
  publisher: { "@id": `${siteConfig.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="scroll-smooth">
      <body className="min-h-screen bg-ink text-zinc-100 antialiased">
        {/* Brand intro (CSS only — see globals.css). Not a heading, so pages keep a single <h1>. */}
        <div className="splash" aria-hidden="true">
          <div className="splash-mark text-center">
            <p className="font-display text-3xl font-bold tracking-[0.4em] text-white sm:text-5xl">
              DIVUCLOSET
            </p>
            <p className="mt-3 text-xs tracking-[0.3em] text-zinc-500 sm:text-sm">
              by {siteConfig.owner}
            </p>
          </div>
        </div>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[10000] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main" className="pb-24 lg:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />

        <JsonLd data={organization} />
        <JsonLd data={website} />
      </body>
    </html>
  );
}
