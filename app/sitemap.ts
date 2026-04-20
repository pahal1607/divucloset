import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://divucloset.com";

  const routes = [
    "",
    "/women",
    "/men",
    "/shoes",
    "/beauty-products",
    "/jewelry",
    "/contact-us",
    "/cart",
    "/checkout",
    "/login",
    "/search",
    "/track",
    "/track-order",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}