import type { MetadataRoute } from "next";
import { LOCATION_PAGES } from "@/data/locations";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = "https://lesliesweavingstudio.com";
  
  const entries: MetadataRoute.Sitemap = [];

  for (const page of LOCATION_PAGES) {
    const citySlug = page.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const keywordSlug = page.slug.substring(citySlug.length + 1);

    // /locations/[slug]
    entries.push({
      url: `${baseUrl}/locations/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    
    // /fabric/[city]/[keyword]
    entries.push({
      url: `${baseUrl}/fabric/${citySlug}/${keywordSlug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
