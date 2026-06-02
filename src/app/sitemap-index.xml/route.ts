import { NextResponse } from "next/server";
import { Client } from "pg";
import { CITIES } from "@/data/locations";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache/revalidate every hour

const CHUNK_SIZE = 3000;

export async function GET() {
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
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (let i = 0; i < numChunks; i++) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>https://www.lesliesweavingstudio.com/sitemap/${i}.xml</loc>\n`;
    xml += `  </sitemap>\n`;
  }
  xml += `</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
