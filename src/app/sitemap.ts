import type { MetadataRoute } from "next";
import { LOCATION_PAGES } from "@/data/locations";
import { NATIONAL_PAGES } from "@/data/national-pages";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = "https://lesliesweavingstudio.com";
  
  const entries: MetadataRoute.Sitemap = [];

  // Add Local Pages (240)
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

  // Add National Pages (4000+)
  for (const page of NATIONAL_PAGES) {
    entries.push({
      url: `${baseUrl}/fabric/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
