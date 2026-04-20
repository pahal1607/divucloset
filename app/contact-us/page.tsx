"use client";

import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Camera,
  Clock3,
} from "lucide-react";

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
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          {/* LEFT */}
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              Contact Us
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              We’d love to help you
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Reach out for order help, product questions, delivery support, or
              anything else related to DivuCloset.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href="https://wa.me/916392342474"
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-white/10 bg-zinc-950 p-5 transition hover:border-white/20"
              >
                <MessageCircle className="h-6 w-6 text-green-400" />
                <h2 className="mt-4 text-xl font-semibold">WhatsApp</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Fastest way to contact us
                </p>
                <p className="mt-3 text-sm font-medium text-white">
                  +91 63923 42474
                </p>
              </a>

              <a
                href="mailto:divucloset@gmail.com"
                className="rounded-3xl border border-white/10 bg-zinc-950 p-5 transition hover:border-white/20"
              >
                <Mail className="h-6 w-6 text-blue-400" />
                <h2 className="mt-4 text-xl font-semibold">Email</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  For support and queries
                </p>
                <p className="mt-3 text-sm font-medium text-white break-all">
                  divucloset@gmail.com
                </p>
              </a>

              <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
                <Phone className="h-6 w-6 text-yellow-400" />
                <h2 className="mt-4 text-xl font-semibold">Phone</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Call during working hours
                </p>
                <p className="mt-3 text-sm font-medium text-white">
                  +91 63923 42474
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
                <Clock3 className="h-6 w-6 text-purple-400" />
                <h2 className="mt-4 text-xl font-semibold">Working Hours</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  We usually respond quickly
                </p>
                <p className="mt-3 text-sm font-medium text-white">
                  10:00 AM – 8:00 PM
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-zinc-950 p-5">
              <MapPin className="h-6 w-6 text-red-400" />
              <h2 className="mt-4 text-xl font-semibold">Address</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Kanpur,
                <br />
                Kanpur, Uttar Pradesh - 208027
              </p>
            </div>

            <a
              href="https://instagram.com/divucloset._"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20"
            >
              <Camera className="h-5 w-5" />
              Instagram
            </a>
          </div>

          {/* RIGHT */}
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Send a message</h2>
            <p className="mt-2 text-sm text-zinc-400">
              This form is currently for display/UI. We can connect it to
              Supabase next.
            </p>

            <form className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-500"
              />

              <textarea
                rows={7}
                placeholder="Write your message..."
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-500"
              />

              <button
                type="button"
                className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-zinc-200"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black p-5">
              <p className="text-sm text-zinc-400">
                For fastest response, contact us on WhatsApp.
              </p>
              <a
                href="https://wa.me/916392342474"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-black"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}