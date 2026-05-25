import type { MetadataRoute } from "next";
import { Client } from "pg";
import { CITIES } from "@/data/locations";

export const dynamic = "force-static";
export const revalidate = 3600; // Cache/revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const baseUrl = "https://www.lesliesweavingstudio.com";
  
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/visualizer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/drafts`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brochure`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Add all city index pages to sitemap
  for (const city of CITIES) {
    const citySlug = city.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    entries.push({
      url: `${baseUrl}/locations/by-city/${citySlug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  // Fetch all location-based pages from PostgreSQL database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  await client.connect();
  const res = await client.query(
    "SELECT url, updated_at FROM page_indexing WHERE slug_category IN ('location', 'fabric') ORDER BY id ASC"
  );
  await client.end();

  for (const row of res.rows) {
    entries.push({
      url: row.url,
      lastModified: row.updated_at ? new Date(row.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
