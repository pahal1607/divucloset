import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact DivuCloset for order help, support, product questions, delivery updates, and WhatsApp assistance.",
  alternates: {
    canonical: "/contact-us",
  },
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-zinc-400">
          Contact DivuCloset for support and order help.
        </p>
      </div>
    </div>
  );
}