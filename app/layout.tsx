import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

export const metadata = {
  title: "DivuCloset",
  description: "Premium E-commerce Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}