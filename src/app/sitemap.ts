import type { MetadataRoute } from "next";
import { Client } from "pg";
import { CITIES } from "@/data/locations";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache/revalidate every hour

const CHUNK_SIZE = 3000;

export async function generateSitemaps() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const countRes = await client.query(
    "SELECT COUNT(*) as count FROM page_indexing WHERE slug_category IN ('location', 'fabric')"
  );
  await client.end();

  const dbCount = parseInt(countRes.rows[0].count, 10);
  const staticCount = 5 + CITIES.length;
  const totalCount = staticCount + dbCount;

  const numChunks = Math.ceil(totalCount / CHUNK_SIZE);
  const sitemaps = [];
  for (let i = 0; i < numChunks; i++) {
    sitemaps.push({ id: i });
  }
  return sitemaps;
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const startOffset = id * CHUNK_SIZE;
  const endOffset = startOffset + CHUNK_SIZE;

  const now = new Date();
  const baseUrl = "https://www.lesliesweavingstudio.com";

  // Construct all static entries
  const staticEntries: MetadataRoute.Sitemap = [
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
    staticEntries.push({
      url: `${baseUrl}/locations/by-city/${citySlug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const entries: MetadataRoute.Sitemap = [];

  // Add static entries if they fall within the current chunk window
  if (startOffset < staticEntries.length) {
    const staticSlice = staticEntries.slice(startOffset, endOffset);
    entries.push(...staticSlice);
  }

  // Calculate DB query limit and offset
  const dbOffset = Math.max(0, startOffset - staticEntries.length);
  const dbLimit = CHUNK_SIZE - entries.length;

  if (dbLimit > 0) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
    const res = await client.query(
      "SELECT url, updated_at FROM page_indexing WHERE slug_category IN ('location', 'fabric') ORDER BY id ASC LIMIT $1 OFFSET $2",
      [dbLimit, dbOffset]
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
  }

  return entries;
}
