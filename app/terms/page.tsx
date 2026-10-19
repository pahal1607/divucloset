import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "../components/PolicyPage";
import { siteConfig } from "../lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you browse and buy from DivuCloset — orders, pricing, payment, delivery, returns and more.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const { contact } = siteConfig;

  return (
    <PolicyPage
      eyebrow="Policies"
      title="Terms & Conditions"
      intro="By using divucloset.com and placing an order, you agree to the terms below."
    >
      <h2>About us</h2>
      <p>
        divucloset.com is operated by {siteConfig.owner} (&quot;DivuCloset&quot;, &quot;we&quot;),
        based in {contact.address.locality}, {contact.address.region}, India.
      </p>

      <h2>Products and pricing</h2>
      <ul>
        <li>
          We try to describe and photograph every product accurately. Colours may look slightly
          different on different screens.
        </li>
        <li>Prices are in Indian Rupees (₹) and may change without notice.</li>
        <li>
          If we notice a pricing or stock error on an order, we may cancel it and refund any payment
          you made.
        </li>
      </ul>

      <h2>Orders and payment</h2>
      <ul>
        <li>
          An order is confirmed only after we verify your UPI payment. Until then it shows as
          &quot;Payment Verification&quot;.
        </li>
        <li>
          Please enter correct delivery details. We are not responsible for delays or failed delivery
          caused by incorrect information.
        </li>
        <li>
          We may decline or cancel an order if payment cannot be verified or an item is no longer
          available. In that case we will refund any amount you have paid.
        </li>
      </ul>

      <h2>Delivery, returns and refunds</h2>
      <p>
        Delivery, returns and refunds are covered in our{" "}
        <Link href="/shipping-returns">Shipping &amp; Returns</Link> policy, which forms part of
        these terms.
      </p>

      <h2>Your account</h2>
      <p>
        You are responsible for keeping your login details safe and for activity on your account.
        Please tell us straight away if you think someone else has used it.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Please do not misuse the website — for example by attempting to disrupt it, access other
        people&apos;s information, or submit false payment proof. We may suspend accounts that do.
      </p>

      <h2>Our content</h2>
      <p>
        The DivuCloset name, logo and the content we create for this site belong to us. Please do not
        copy or reuse them without permission.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent permitted by law, our liability for any claim relating to an order is limited
        to the amount you paid for that order.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any dispute will be subject to the courts at{" "}
        {contact.address.locality}, {contact.address.region}.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${contact.email}`}>{contact.email}</a> or
        visit our <Link href="/contact-us">contact page</Link>.
      </p>
    </PolicyPage>
  );
}
