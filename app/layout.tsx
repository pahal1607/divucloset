import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

export const metadata: Metadata = {
  metadataBase: new URL("https://divucloset.com"),
  title: {
    default: "DivuCloset | Women, Men, Shoes, Jewelry & Beauty Products",
    template: "%s | DivuCloset",
  },
  description:
    "Shop women’s fashion, men’s wear, shoes, jewelry, and beauty products online at DivuCloset. Discover stylish collections with fast support and easy shopping.",
  keywords: [
    "DivuCloset",
    "online fashion store India",
    "women clothing online",
    "men clothing online",
    "shoes online India",
    "jewelry online India",
    "beauty products online",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DivuCloset | Premium Fashion Store",
    description:
      "Shop stylish women’s wear, men’s fashion, shoes, jewelry, and beauty products at DivuCloset.",
    url: "https://divucloset.com",
    siteName: "DivuCloset",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DivuCloset | Premium Fashion Store",
    description:
      "Shop stylish women’s wear, men’s fashion, shoes, jewelry, and beauty products at DivuCloset.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Loader />
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}