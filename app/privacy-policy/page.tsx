import type { Metadata } from "next";
import PolicyPage from "../components/PolicyPage";
import { siteConfig } from "../lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal information DivuCloset collects when you shop with us, how we use it, and how you can ask us to change or delete it.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const { contact } = siteConfig;

  return (
    <PolicyPage
      eyebrow="Policies"
      title="Privacy Policy"
      intro="This page explains what information we collect when you use divucloset.com, why we collect it, and your choices."
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> your email address and login information when you create an
          account.
        </li>
        <li>
          <strong>Order details:</strong> your name, phone number, delivery address and the items you
          order.
        </li>
        <li>
          <strong>Payment verification details:</strong> the payment app you used, your UTR number and
          the payment screenshot you upload, so we can confirm your payment. We do not collect or store
          card or bank-login details.
        </li>
        <li>
          <strong>Basic technical data:</strong> your cart and login session are saved in your browser
          so the site works.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process, verify, ship and track your orders.</li>
        <li>To contact you about your order or a support request.</li>
        <li>To keep the store secure and prevent fraud.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>Who can see it</h2>
      <p>
        Your information is visible only to the people who run the store and to the service providers
        that help us operate it (for example our database and hosting providers, and couriers who need
        your name, phone number and address to deliver your order). We share it only as needed for
        these purposes, or if the law requires.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We use your browser&apos;s storage to remember your cart and to keep you logged in. You can clear
        this at any time from your browser settings, but your cart and login will then be reset.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete the personal information we hold about you by
        emailing <a href={`mailto:${contact.email}`}>{contact.email}</a>. We may need to keep certain
        order records for as long as the law requires.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will update the date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </PolicyPage>
  );
}
