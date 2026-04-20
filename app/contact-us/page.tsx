import type { Metadata } from "next";
import ContactUsClient from "../components/ContactUsClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact DivuCloset for order help, support, product questions, delivery updates, and WhatsApp assistance.",
  alternates: {
    canonical: "/contact-us",
  },
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}