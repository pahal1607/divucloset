export type CategoryConfig = {
  slug: string;
  /** Short label used in navigation */
  label: string;
  /** Visible page heading (h1) */
  h1: string;
  /** <title> text (the site name is appended automatically) */
  title: string;
  /** Meta description */
  description: string;
  /** Paragraph shown under the heading — real, useful text for shoppers and search engines */
  intro: string;
};

export const categories: CategoryConfig[] = [
  {
    slug: "women",
    label: "Women",
    h1: "Women's Sarees, Tops & Ethnic Wear",
    title: "Women's Sarees, Tops, Kurti Sets & Dresses Online",
    description:
      "Shop women's sarees, printed tops, kurti sets, co-ord sets, jeans and dresses online at DivuCloset. New styles, clear prices and delivery across India.",
    intro:
      "From Banarasi and silk-blend sarees to everyday printed tops, kurti sets, co-ords and jeans — browse the latest women's styles at DivuCloset. Every listing shows its available sizes and current price, so you can pick with confidence.",
  },
  {
    slug: "men",
    label: "Men",
    h1: "Men's Shirts & Casual Wear",
    title: "Men's Shirts, Linen Sets & Casual Wear Online",
    description:
      "Shop men's casual shirts, linen shirt-and-pant sets and more at DivuCloset. Comfortable fits, clear sizing and delivery across India.",
    intro:
      "Slim and relaxed-fit casual shirts, linen-blend shirt and pant sets and more for everyday and weekend wear. Check sizes on each product page before you order.",
  },
  {
    slug: "shoes",
    label: "Shoes",
    h1: "Shoes & Footwear",
    title: "Shoes & Footwear Online",
    description:
      "Browse shoes and footwear at DivuCloset. Casual and everyday styles with size availability shown on every product.",
    intro:
      "Casual and everyday footwear picked to go with your wardrobe. Select your shoe size on the product page to see what's in stock.",
  },
  {
    slug: "beauty-products",
    label: "Beauty",
    h1: "Beauty Products",
    title: "Beauty & Skincare Products Online",
    description:
      "Shop beauty and personal care products online at DivuCloset, with clear prices and delivery across India.",
    intro:
      "A small, curated selection of beauty and personal-care products to complete your look.",
  },
  {
    slug: "jewelry",
    label: "Jewelry",
    h1: "Jewelry & Accessories",
    title: "Jewelry & Fashion Accessories Online",
    description:
      "Shop earrings, necklaces and fashion jewelry online at DivuCloset, with clear prices and delivery across India.",
    intro:
      "Fashion jewelry and accessories to pair with sarees, ethnic wear and everyday outfits.",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}
