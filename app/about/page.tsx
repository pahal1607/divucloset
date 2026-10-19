import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "../components/PolicyPage";
import { addressLine, siteConfig } from "../lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "DivuCloset is an online fashion store run by Divyanshi in Kanpur, India — sarees, women's and men's wear, shoes, jewelry and beauty picks with clear prices and sizes.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PolicyPage
      eyebrow="Our story"
      title="About DivuCloset"
      intro={`DivuCloset is an online fashion store run by ${siteConfig.owner}, based in ${addressLine.replace(", India", "")}.`}
      showUpdated={false}
    >
      <h2>What we do</h2>
      <p>
        We bring together sarees, everyday tops, kurti sets, co-ord sets, jeans, men&apos;s shirts,
        shoes, jewelry and beauty picks in one place, so you can put together a whole look without
        visiting five different shops.
      </p>

      <h2>How we try to run the store</h2>
      <ul>
        <li>
          <strong>Clear prices.</strong> The price you see on a product page is the price you pay for
          that item.
        </li>
        <li>
          <strong>Real sizes.</strong> Each product shows which sizes are actually in stock right now.
        </li>
        <li>
          <strong>A person to talk to.</strong> Message us on WhatsApp and a real person replies.
        </li>
      </ul>

      <h2>Ordering</h2>
      <p>
        Choose your size, add to cart and check out. We currently accept payment by UPI — you pay
        using the QR code at checkout and upload your payment screenshot, and we confirm your order
        once the payment is verified. You can follow progress on the{" "}
        <Link href="/track">order tracking page</Link>.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, feedback or something not right with an order? Visit our{" "}
        <Link href="/contact-us">contact page</Link> or message us on{" "}
        <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        .
      </p>
    </PolicyPage>
  );
}
