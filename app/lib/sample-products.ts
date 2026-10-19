// Only used when the environment variable USE_SAMPLE_DATA=1 is set (local previews
// without a database). Production never reads this file's data.
import type { Product } from "./product-utils";

function art(c1: string, c2: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="600" height="800" fill="url(#g)"/><circle cx="300" cy="300" r="120" fill="rgba(255,255,255,0.10)"/><rect x="170" y="440" width="260" height="180" rx="90" fill="rgba(255,255,255,0.08)"/><text x="300" y="730" font-family="Georgia,serif" font-size="26" text-anchor="middle" fill="rgba(255,255,255,0.55)">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const full = { S: 4, M: 6, L: 5, XL: 2 };

export const SAMPLE_PRODUCTS: Product[] = [
  { id: 37, name: "Hesika Art Silk Daily Wear Saree (Pack of 2, Black)", category: "Women", subcategory: "Sarees", description: "Lightweight art silk saree with subtle embellishment, easy to drape for daily wear. Pack of two.", price: 800, mrp: 1080, image_url: art("#1c1c1f", "#4b3f72", "Silk Saree"), sizes: { Free: 9 } },
  { id: 35, name: "Starly Ready-to-Wear Pre-Draped Silk Blend Saree (Pink)", category: "Women", subcategory: "Sarees", description: "Pre-draped saree with embroidery. Step in, tuck and go — no pleating required.", price: 3200, mrp: 4320, image_url: art("#7a2548", "#e08fb0", "Pre-Draped Saree"), sizes: { Free: 3 } },
  { id: 33, name: "Self Design Banarasi Silk Blend Saree (Magenta)", category: "Women", subcategory: "Sarees", description: "Banarasi-style silk blend saree with a self-design weave and a rich magenta tone.", price: 699, image_url: art("#6b1038", "#c2417a", "Banarasi Saree"), sizes: { Free: 12 } },
  { id: 32, name: "Bollywood Jimmy Jimmy Embellished Silk Blend Saree (Green)", category: "Women", subcategory: "Sarees", description: "Embellished silk blend saree in emerald green, made for festive evenings.", price: 1800, mrp: 2430, image_url: art("#0f3d2e", "#2f8f6b", "Festive Saree"), sizes: { Free: 5 } },
  { id: 29, name: "Flared High Rise Blue Jeans", category: "Women", subcategory: "Jeans", description: "High-rise flared jeans with a flattering fit and stretch comfort.", price: 650, image_url: art("#16233f", "#3b6aa8", "Flared Jeans"), sizes: { "28": 4, "30": 6, "32": 3 } },
  { id: 27, name: "Casual Regular Sleeves Printed Women Top (Light Blue)", category: "Women", subcategory: "Tops", description: "Easy printed top with regular sleeves for everyday wear.", price: 450, image_url: art("#2a4a63", "#8ec1e6", "Printed Top"), sizes: full },
  { id: 22, name: "Party Sleeveless Self Design Women Top (Black)", category: "Women", subcategory: "Tops", description: "Sleeveless self-design top that goes from day to evening.", price: 471, image_url: art("#101012", "#3a3a40", "Party Top"), sizes: { S: 2, M: 2, L: 1 } },
  { id: 6, name: "Soft Beige Kurti Set", category: "Women", subcategory: "Kurti Sets", description: "Soft beige kurti set with a comfortable straight cut.", price: 1899, mrp: 2564, image_url: art("#5e4d3a", "#d9c3a3", "Kurti Set"), sizes: full },
  { id: 5, name: "Classic Black Co-ord Set", category: "Women", subcategory: "Co-ord Sets", description: "Classic black co-ord set — dress it up or keep it casual.", price: 2199, image_url: art("#0c0c0d", "#2c2c33", "Co-ord Set"), sizes: full },
  { id: 4, name: "Midnight Satin Dress", category: "Women", subcategory: "Dresses", description: "Midnight satin dress with a graceful fall.", price: 2499, mrp: 3374, image_url: art("#0d1030", "#3a3f91", "Satin Dress"), sizes: full },
  { id: 45, name: "Men Slim Fit Striped Spread Collar Casual Shirt", category: "Men", subcategory: "Shirts", description: "Slim-fit striped casual shirt with a spread collar.", price: 422, mrp: 570, image_url: art("#1d2b3a", "#6f8aa6", "Slim Fit Shirt"), sizes: full },
  { id: 44, name: "Men Relaxed Fit Striped Spread Collar Casual Shirt", category: "Men", subcategory: "Shirts", description: "Relaxed-fit striped casual shirt, breathable and easy.", price: 410, mrp: 554, image_url: art("#2b2f23", "#8a9367", "Relaxed Shirt"), sizes: full },
  { id: 43, name: "Dearise Men Linen Blend Shirt & Pant Set", category: "Men", subcategory: "Sets", description: "Linen blend shirt and pant set for warm days.", price: 999, mrp: 1349, image_url: art("#3a342a", "#c4b79c", "Linen Set"), sizes: { S: 1, M: 2, L: 3, XL: 1 } },
  { id: 61, name: "White Court Sneakers", category: "Shoes", subcategory: "Sneakers", description: "Clean white sneakers that go with everything.", price: 1299, image_url: art("#1a1a1c", "#d8d8dc", "Sneakers"), sizes: { "7": 3, "8": 4, "9": 2 } },
  { id: 71, name: "Gold-Tone Jhumka Earrings", category: "Jewelry", subcategory: "Earrings", description: "Lightweight gold-tone jhumkas for festive and everyday looks.", price: 349, image_url: art("#3b2a07", "#d4a73c", "Jhumkas"), sizes: { Free: 14 } },
  { id: 81, name: "Hydrating Lip Balm Duo", category: "Beauty Products", subcategory: "Lips", description: "A pair of hydrating lip balms for everyday care.", price: 199, image_url: art("#3a1020", "#e0728f", "Lip Balm"), sizes: { Free: 20 } },
];
