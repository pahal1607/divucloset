import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://divucloset.com",
      lastModified: new Date(),
    },
    {
      url: "https://divucloset.com/women",
      lastModified: new Date(),
    },
    {
      url: "https://divucloset.com/men",
      lastModified: new Date(),
    },
    {
      url: "https://divucloset.com/shoes",
      lastModified: new Date(),
    },
    {
      url: "https://divucloset.com/beauty-products",
      lastModified: new Date(),
    },
    {
      url: "https://divucloset.com/jewelry",
      lastModified: new Date(),
    },
    {
      url: "https://divucloset.com/contact-us",
      lastModified: new Date(),
    },
  ];
}