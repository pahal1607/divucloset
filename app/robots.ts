import type { MetadataRoute } from "next";
import { siteConfig } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/checkout",
        "/orders",
        "/addresses",
        "/cart",
        "/login",
        "/track",
        "/track-order",
        "/search",
        "/api/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
