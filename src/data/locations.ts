/**
 * Programmatic SEO location data for Leslie's Weaving
 * Each entry generates a unique /locations/[slug] page
 *
 * South Florida pool: ~40 cities × 6 keyword clusters = 240 pages
 * All within driving distance of Coral Springs, FL — real consultation markets
 *
 * Keyword clusters:
 * 1. Custom Upholstery Fabric
 * 2. Bespoke Drapery Fabric
 * 3. Custom Woven Fabric
 * 4. Handwoven Fabric for Interior Designers
 * 5. Custom Textile Studio
 * 6. Luxury Fabric for Interior Design
 *
 * Audience variants: Interior Designers, Fashion Designers, Judaica & Ceremonial
 */

export interface LocationPage {
  slug: string;
  city: string;
  county: string;
  state: string;
  keyword: string;
  keywordShort: string;
  audience: string;
  neighbors: string[];
  bodyParagraph1: string;
  bodyParagraph2: string;
  closingSignal: string;
}

// ─── City definitions ────────────────────────────────────────────────────────

const CITIES: Array<{
  city: string;
  county: string;
  neighbors: string[];
  character: string; // used to vary body copy
  audienceVariant: "interior" | "fashion" | "judaica" | "interior";
}> = [
    // Miami-Dade
    { city: "Coral Gables", county: "Miami-Dade County", neighbors: ["Coconut Grove", "Brickell", "South Miami"], character: "Mediterranean revival estates and luxury residential commissions", audienceVariant: "interior" },
    { city: "Miami Beach", county: "Miami-Dade County", neighbors: ["South Beach", "Mid-Beach", "Surfside"], character: "coastal modernism and high-design hospitality interiors", audienceVariant: "interior" },
    { city: "Coconut Grove", county: "Miami-Dade County", neighbors: ["Coral Gables", "South Miami", "Brickell"], character: "historic homes, canopy streets, and handmade design sensibility", audienceVariant: "interior" },
    { city: "Brickell", county: "Miami-Dade County", neighbors: ["Downtown Miami", "Coral Gables", "Coconut Grove"], character: "luxury high-rise residences and boutique commercial interiors", audienceVariant: "interior" },
    { city: "Wynwood", county: "Miami-Dade County", neighbors: ["Midtown Miami", "Design District", "Edgewater"], character: "art-forward studios and fashion-forward creative spaces", audienceVariant: "fashion" },
    { city: "Miami Design District", county: "Miami-Dade County", neighbors: ["Wynwood", "Midtown Miami", "Edgewater"], character: "the premier luxury design trade destination in the Southeast", audienceVariant: "interior" },
    { city: "Aventura", county: "Miami-Dade County", neighbors: ["Hallandale Beach", "Sunny Isles Beach", "North Miami Beach"], character: "upscale residential towers and luxury retail interiors", audienceVariant: "interior" },
    { city: "Doral", county: "Miami-Dade County", neighbors: ["Hialeah", "Medley", "Miami Lakes"], character: "corporate campuses and high-end residential communities", audienceVariant: "interior" },
    { city: "Kendall", county: "Miami-Dade County", neighbors: ["Pinecrest", "South Miami", "Westchester"], character: "affluent suburban homes and custom residential projects", audienceVariant: "interior" },
    { city: "Pinecrest", county: "Miami-Dade County", neighbors: ["Kendall", "South Miami", "Coral Gables"], character: "estate-scale residential interiors with bespoke specification", audienceVariant: "interior" },
    { city: "South Miami", county: "Miami-Dade County", neighbors: ["Coral Gables", "Pinecrest", "Kendall"], character: "boutique residential studios and independent design practices", audienceVariant: "interior" },
    { city: "Key Biscayne", county: "Miami-Dade County", neighbors: ["Coconut Grove", "Brickell", "Virginia Key"], character: "island estates and coastal luxury residences", audienceVariant: "interior" },
    { city: "Hialeah", county: "Miami-Dade County", neighbors: ["Doral", "Miami Lakes", "Opa-locka"], character: "vibrant cultural community with strong ceremonial and fashion traditions", audienceVariant: "judaica" },
    { city: "Sunny Isles Beach", county: "Miami-Dade County", neighbors: ["Aventura", "Bal Harbour", "North Miami Beach"], character: "ultra-luxury oceanfront towers and bespoke residential commissions", audienceVariant: "interior" },
    { city: "Bal Harbour", county: "Miami-Dade County", neighbors: ["Surfside", "Sunny Isles Beach", "Bay Harbor Islands"], character: "the most exclusive residential enclave in South Florida", audienceVariant: "interior" },
    { city: "Surfside", county: "Miami-Dade County", neighbors: ["Bal Harbour", "Miami Beach", "Bay Harbor Islands"], character: "intimate luxury residences and boutique hospitality interiors", audienceVariant: "interior" },
    // Broward
    { city: "Fort Lauderdale", county: "Broward County", neighbors: ["Wilton Manors", "Oakland Park", "Lauderdale-by-the-Sea"], character: "waterfront estates, yachting culture, and luxury hospitality design", audienceVariant: "interior" },
    { city: "Coral Springs", county: "Broward County", neighbors: ["Parkland", "Margate", "Coconut Creek"], character: "our home base — a thriving design community in northwest Broward", audienceVariant: "interior" },
    { city: "Weston", county: "Broward County", neighbors: ["Davie", "Southwest Ranches", "Pembroke Pines"], character: "master-planned luxury communities with high residential design standards", audienceVariant: "interior" },
    { city: "Plantation", county: "Broward County", neighbors: ["Davie", "Fort Lauderdale", "Sunrise"], character: "established residential neighborhoods and boutique commercial interiors", audienceVariant: "interior" },
    { city: "Davie", county: "Broward County", neighbors: ["Plantation", "Weston", "Cooper City"], character: "equestrian estates and custom residential commissions", audienceVariant: "interior" },
    { city: "Hollywood", county: "Broward County", neighbors: ["Hallandale Beach", "Pembroke Pines", "Dania Beach"], character: "coastal residences and boutique hospitality interiors", audienceVariant: "interior" },
    { city: "Hallandale Beach", county: "Broward County", neighbors: ["Hollywood", "Aventura", "Pembroke Park"], character: "luxury condominiums and coastal residential interiors", audienceVariant: "interior" },
    { city: "Pompano Beach", county: "Broward County", neighbors: ["Deerfield Beach", "Lighthouse Point", "Fort Lauderdale"], character: "waterfront homes and an emerging luxury design market", audienceVariant: "interior" },
    { city: "Deerfield Beach", county: "Broward County", neighbors: ["Pompano Beach", "Boca Raton", "Lighthouse Point"], character: "coastal residential communities and boutique design studios", audienceVariant: "interior" },
    { city: "Lighthouse Point", county: "Broward County", neighbors: ["Pompano Beach", "Deerfield Beach", "Hillsboro Beach"], character: "waterfront estates and exclusive residential commissions", audienceVariant: "interior" },
    { city: "Sunrise", county: "Broward County", neighbors: ["Plantation", "Tamarac", "Lauderhill"], character: "growing residential design market with strong commercial sector", audienceVariant: "interior" },
    { city: "Pembroke Pines", county: "Broward County", neighbors: ["Miramar", "Cooper City", "Hollywood"], character: "large-scale residential communities with active design practices", audienceVariant: "interior" },
    { city: "Miramar", county: "Broward County", neighbors: ["Pembroke Pines", "Hollywood", "Southwest Ranches"], character: "diverse residential communities and ceremonial event venues", audienceVariant: "judaica" },
    { city: "Parkland", county: "Broward County", neighbors: ["Coral Springs", "Coconut Creek", "Boca Raton"], character: "estate-scale residential interiors in a prestigious gated community", audienceVariant: "interior" },
    // Palm Beach
    { city: "Boca Raton", county: "Palm Beach County", neighbors: ["Delray Beach", "Deerfield Beach", "Highland Beach"], character: "one of Florida's most active luxury residential design markets", audienceVariant: "interior" },
    { city: "Delray Beach", county: "Palm Beach County", neighbors: ["Boca Raton", "Boynton Beach", "Highland Beach"], character: "a vibrant arts community with strong boutique design culture", audienceVariant: "interior" },
    { city: "West Palm Beach", county: "Palm Beach County", neighbors: ["Palm Beach", "Lake Worth", "Riviera Beach"], character: "the cultural and design hub of Palm Beach County", audienceVariant: "interior" },
    { city: "Palm Beach", county: "Palm Beach County", neighbors: ["West Palm Beach", "Palm Beach Shores", "Lake Worth"], character: "the most storied luxury residential market in Florida", audienceVariant: "interior" },
    { city: "Palm Beach Gardens", county: "Palm Beach County", neighbors: ["Jupiter", "North Palm Beach", "Juno Beach"], character: "upscale planned communities and luxury residential design", audienceVariant: "interior" },
    { city: "Jupiter", county: "Palm Beach County", neighbors: ["Palm Beach Gardens", "Tequesta", "Juno Beach"], character: "coastal estates and a growing luxury residential design market", audienceVariant: "interior" },
    { city: "Boynton Beach", county: "Palm Beach County", neighbors: ["Delray Beach", "Lake Worth", "Greenacres"], character: "active residential design community with strong ceremonial traditions", audienceVariant: "judaica" },
    { city: "Wellington", county: "Palm Beach County", neighbors: ["West Palm Beach", "Loxahatchee", "Royal Palm Beach"], character: "equestrian estates and luxury residential commissions", audienceVariant: "interior" },
    { city: "Lake Worth Beach", county: "Palm Beach County", neighbors: ["Boynton Beach", "West Palm Beach", "Lantana"], character: "arts-forward community with boutique design studios and fashion makers", audienceVariant: "fashion" },
    { city: "Boca Raton Fashion District", county: "Palm Beach County", neighbors: ["Boca Raton", "Delray Beach", "Deerfield Beach"], character: "South Florida's most active market for fashion and costume design", audienceVariant: "fashion" },
  ];

// ─── Keyword clusters ────────────────────────────────────────────────────────

const KEYWORDS: Array<{
  keyword: string;
  keywordShort: string;
  slug: string;
  p1Template: (city: string, character: string, audience: string) => string;
  p2Template: (city: string, neighbors: string[]) => string;
  closingTemplate: (city: string, neighbors: string[], county: string) => string;
}> = [
    {
      keyword: "Custom Upholstery Fabric",
      keywordShort: "upholstery fabric",
      slug: "custom-upholstery-fabric",
      p1Template: (city, character, audience) =>
        `${audience} in ${city} work with some of the most discerning clients in South Florida — clients whose homes reflect ${character}. When a project calls for upholstery fabric that no showroom carries, woven to a client's exact specification in a colorway that belongs to their home alone, Leslie's Weaving is the only studio within a thousand miles that can deliver it.`,
      p2Template: (city, neighbors) =>
        `Our 72-inch computerized Dobby loom in Coral Springs weaves 100% North American cotton upholstery fabric at 24-shaft complexity — intricate, exclusive patterns that mass-market suppliers cannot replicate. Every yard is woven by hand, inspected by hand, and shipped directly to your studio or your client's address in ${city}, ${neighbors[0]}, or anywhere in South Florida.`,
      closingTemplate: (city, neighbors, county) =>
        `Serving ${city}, ${neighbors.join(", ")}, and the broader ${county} design community. We bring the sample book to you.`,
    },
    {
      keyword: "Bespoke Drapery Fabric",
      keywordShort: "drapery fabric",
      slug: "bespoke-drapery-fabric",
      p1Template: (city, character, audience) =>
        `${city} interiors are defined by ${character}. When drapery fabric needs to carry a room — reading as luxury from across the space and holding up to South Florida's coastal light — Leslie's Weaving produces bespoke drapery fabric in 100% cotton, woven to your exact pattern and colorway on a 72-inch Dobby loom in Coral Springs.`,
      p2Template: (city, neighbors) =>
        `With 24-shaft pattern complexity and 77 colorways available, we can match virtually any design direction. No two commissions are alike — your client's drapery fabric will not appear in any other showroom or on any other project in ${city}, ${neighbors[0]}, or anywhere else. Every yard is woven by hand and shipped directly to your studio.`,
      closingTemplate: (city, neighbors, county) =>
        `Serving interior designers throughout ${city}, ${neighbors.join(", ")}, and ${county}. Consultations available at your studio or ours in Coral Springs.`,
    },
    {
      keyword: "Custom Woven Fabric",
      keywordShort: "custom woven fabric",
      slug: "custom-woven-fabric",
      p1Template: (city, character, audience) =>
        `Custom woven fabric is the specification that separates a truly bespoke interior from one that merely uses expensive materials. ${audience} in ${city} — a market defined by ${character} — increasingly specify handwoven fabric because it is the one element that cannot be sourced from any trade showroom. Leslie's Weaving is the only studio in South Florida producing it.`,
      p2Template: (city, neighbors) =>
        `Our 72-inch Dobby loom in Coral Springs produces custom woven fabric in 100% North American cotton at 24-shaft complexity. We work directly with designers in ${city} and throughout ${neighbors.join(" and ")} to develop patterns, colorways, and yardage specifications from scratch. Minimum order is one yard — maximum is your entire project.`,
      closingTemplate: (city, neighbors, county) =>
        `Serving ${city}, ${neighbors.join(", ")}, and all of ${county}. Studio consultations and in-studio visits available — we are 30–60 minutes from most ${county} design offices.`,
    },
    {
      keyword: "Handwoven Fabric for Interior Designers",
      keywordShort: "handwoven fabric",
      slug: "handwoven-fabric-interior-designers",
      p1Template: (city, character, audience) =>
        `Handwoven fabric occupies a category of its own in the specification hierarchy. For ${audience} in ${city} — where ${character} — it is the material that clients remember long after the project is complete. Leslie's Weaving produces handwoven fabric on a 72-inch computerized Dobby loom in Coral Springs, FL, with patterns and colorways exclusive to each commission.`,
      p2Template: (city, neighbors) =>
        `Every yard we produce is woven by hand, inspected by hand, and documented with a certificate of origin. We serve designers in ${city}, ${neighbors[0]}, and ${neighbors[1]} with studio consultations, sample yardage, and full production runs. Our 100% North American cotton weaves at 24-shaft complexity — a specification no trade showroom in the Southeast can match.`,
      closingTemplate: (city, neighbors, county) =>
        `Serving handwoven fabric clients throughout ${city}, ${neighbors.join(", ")}, and ${county}. We bring the sample book to your studio — no minimum for consultations.`,
    },
    {
      keyword: "Custom Textile Studio",
      keywordShort: "custom textile studio",
      slug: "custom-textile-studio",
      p1Template: (city, character, audience) =>
        `${city}'s design community — shaped by ${character} — deserves a textile studio that works the way the best designers do: from first principles, with no catalog and no compromises. Leslie's Weaving is a custom textile studio in Coral Springs serving ${audience} throughout South Florida with handwoven fabric produced to specification on a 72-inch Dobby loom.`,
      p2Template: (city, neighbors) =>
        `We are not a showroom and we are not a fabric retailer. We are a working studio — one loom, one weaver, one commission at a time. Designers in ${city} and ${neighbors.join(", ")} work with us from concept through delivery: pattern development, colorway selection from 77 Maurice Brassard cotton colors, yardage production, and direct shipping to your studio or your client's address.`,
      closingTemplate: (city, neighbors, county) =>
        `Leslie's Weaving serves ${city}, ${neighbors.join(", ")}, and all of ${county}. Studio visits welcome in Coral Springs — or we come to you.`,
    },
    {
      keyword: "Luxury Fabric for Interior Design",
      keywordShort: "luxury fabric",
      slug: "luxury-fabric-interior-design",
      p1Template: (city, character, audience) =>
        `Luxury fabric for interior design is not about price — it is about provenance. ${audience} in ${city}, where ${character}, understand that the most exclusive material is the one that was made for a single client, on a single loom, by a single maker. Leslie's Weaving produces luxury handwoven fabric in Coral Springs, FL, for designers throughout South Florida.`,
      p2Template: (city, neighbors) =>
        `Our fabric is 100% North American cotton, woven at 24-shaft complexity on a 72-inch computerized Dobby loom. We produce upholstery fabric, drapery fabric, wall panel fabric, and yardage for fashion and ceremonial commissions. Designers in ${city}, ${neighbors[0]}, and ${neighbors[1]} receive the same service: a studio consultation, a custom sample, and a production run that belongs to their client alone.`,
      closingTemplate: (city, neighbors, county) =>
        `Serving luxury interior design clients in ${city}, ${neighbors.join(", ")}, and throughout ${county}. Schedule a consultation — we bring the sample book to you.`,
    },
  ];

// ─── Audience label helper ───────────────────────────────────────────────────

function audienceLabel(variant: string): string {
  if (variant === "fashion") return "Fashion Designers";
  if (variant === "judaica") return "Judaica & Ceremonial Designers";
  return "Interior Designers";
}

// ─── Generate all location pages ─────────────────────────────────────────────

function generateLocationPages(): LocationPage[] {
  const pages: LocationPage[] = [];

  for (const cityDef of CITIES) {
    const audience = audienceLabel(cityDef.audienceVariant);
    for (const kw of KEYWORDS) {
      const slug = `${cityDef.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${kw.slug}`;
      pages.push({
        slug,
        city: cityDef.city,
        county: cityDef.county,
        state: "FL",
        keyword: kw.keyword,
        keywordShort: kw.keywordShort,
        audience,
        neighbors: cityDef.neighbors,
        bodyParagraph1: kw.p1Template(cityDef.city, cityDef.character, audience),
        bodyParagraph2: kw.p2Template(cityDef.city, cityDef.neighbors),
        closingSignal: kw.closingTemplate(cityDef.city, cityDef.neighbors, cityDef.county),
      });
    }
  }

  return pages;
}

export const LOCATION_PAGES: LocationPage[] = generateLocationPages();

// ─── Active pages (published so far) ─────────────────────────────────────────
// This index tracks which pages have been published to the sitemap.
// The daily scheduler increments this by 20 each run.
// Stored in the database — this export is the full pool for reference only.
export const TOTAL_LOCATION_PAGES = LOCATION_PAGES.length;
