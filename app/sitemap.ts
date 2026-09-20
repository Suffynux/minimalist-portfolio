import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.suffynux.com";
  // Fixed date so every deploy does not re-signal "all pages changed" to crawlers.
  // Bump this when page content is meaningfully updated.
  const lastModified = new Date("2026-09-20");

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/creatives`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/journey`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6
    }
  ];
}
