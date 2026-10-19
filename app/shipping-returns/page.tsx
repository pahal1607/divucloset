import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "../components/PolicyPage";
import { siteConfig } from "../lib/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Delivery times, payment by UPI, and the DivuCloset returns and refunds policy.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  const { policies, contact } = siteConfig;

  return (
    <PolicyPage
      eyebrow="Policies"
      title="Shipping & Returns"
      intro="How ordering, delivery, returns and refunds work at DivuCloset."
    >
      <h2>Payment</h2>
      <p>
        We currently accept payment by UPI. At checkout you pay using the QR code shown, then enter
        your payment app and UTR number and upload a screenshot of the payment. Your order moves to
        &quot;Payment Verification&quot; and is confirmed once we have checked the payment.
      </p>

      <h2>Delivery</h2>
      <ul>
        <li>We deliver across India.</li>
        <li>
          The expected delivery date shown at checkout is about {policies.deliveryDays} days from the
          day you place your order. It is an estimate — courier delays can happen.
        </li>
        <li>
          Track your order any time on the <Link href="/track">order tracking page</Link>.
        </li>
      </ul>

      <h2>Returns &amp; exchanges</h2>
      <ul>
        <li>
          You can request a return within <strong>{policies.returnWindowDays} days</strong> of
          receiving your order.
        </li>
        <li>
          Items must be unused, unwashed and in their original condition with all tags and packaging.
        </li>
        <li>
          Jewelry and beauty products can only be returned if unopened and unused, for hygiene
          reasons.
        </li>
        <li>
          If you received a damaged, defective or wrong item, message us within 48 hours of delivery
          with photos and we will make it right.
        </li>
      </ul>

      <h2>How to request a return</h2>
      <p>
        Message us on{" "}
        <a
          href={`https://wa.me/${contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>{" "}
        or email <a href={`mailto:${contact.email}`}>{contact.email}</a> with your order number and
        the reason for the return. We will confirm the next steps.
      </p>

      <h2>Refunds</h2>
      <p>
        Once a returned item reaches us and passes a quick check, we refund the item price to the UPI
        account or method you paid from, and let you know when it has been sent.
      </p>

      <h2>Cancellations</h2>
      <p>
        To cancel an order, contact us as early as possible. If your order has not been shipped yet,
        we will cancel it and refund your payment.
      </p>
    </PolicyPage>
  );
}
