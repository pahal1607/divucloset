/**
 * Single place for everything about the business that shows up on the site.
 * The footer, contact page, policy pages and structured data all read from
 * here, so you only ever edit these values once.
 *
 * Values marked CONFIRM were assumed — please check them before going live.
 */
export const siteConfig = {
  name: "DivuCloset",
  url: "https://divucloset.com",
  tagline: "Sarees, ethnic wear, men's fashion, shoes, jewelry & beauty",
  description:
    "Shop sarees, tops, kurti sets, men's shirts, shoes, jewelry and beauty products online at DivuCloset. Stylish fashion for women and men, delivered across India.",
  owner: "Divyanshi",

  // Taken from your existing contact page.
  contact: {
    whatsapp: "916392342474", // digits only, with country code
    phone: "+91 63923 42474",
    email: "divucloset@gmail.com",
    instagram: "https://instagram.com/divucloset._",
    instagramHandle: "@divucloset._",
    hours: "10:00 AM – 8:00 PM",
    address: {
      locality: "Kanpur",
      region: "Uttar Pradesh",
      postalCode: "208027",
      country: "IN",
    },
  },

  // deliveryDays matches the "expected delivery" your checkout already promises (5 days).
  // CONFIRM returnWindowDays — it is an assumption; change it to your real return policy.
  policies: {
    deliveryDays: 5,
    returnWindowDays: 7,
    payment: "UPI (pay by QR, then upload your payment screenshot)",
    lastUpdated: "18 October 2026",
  },
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const addressLine = `${siteConfig.contact.address.locality}, ${siteConfig.contact.address.region} ${siteConfig.contact.address.postalCode}, India`;

export const policyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
] as const;
