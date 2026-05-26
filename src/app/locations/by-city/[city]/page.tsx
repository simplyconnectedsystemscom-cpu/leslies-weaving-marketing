import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CITIES, KEYWORDS } from "@/data/locations";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return CITIES.map((c) => ({
    city: c.city.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityDef = CITIES.find(
    (c) => c.city.toLowerCase().replace(/[^a-z0-9]+/g, "-") === city
  );

  if (!cityDef) {
    notFound();
  }

  const state = cityDef.state || "FL";
  const title = `Fabric Specs in ${cityDef.city} | Leslie's Weaving`;
  const description = `Browse bespoke 100% cotton fabric and weaving specifications for ${cityDef.city}, ${state === "FL" ? "Florida" : state}. Woven on our 72" Dobby loom.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.lesliesweavingstudio.com/locations/by-city/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.lesliesweavingstudio.com/locations/by-city/${city}`,
      type: "website",
      images: [{ url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032508805/VPKxLBejXfnETyfxXYi5Qj/loom-front_5f9c7f9f.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://d2xsxph8kpxj0f.cloudfront.net/310419663032508805/VPKxLBejXfnETyfxXYi5Qj/loom-front_5f9c7f9f.jpg"],
    },
  };
}

export default async function CityDirectoryPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityDef = CITIES.find(
    (c) => c.city.toLowerCase().replace(/[^a-z0-9]+/g, "-") === city
  );

  if (!cityDef) {
    notFound();
  }

  const cityName = cityDef.city;
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Define categories to group keywords
  const categories = [
    { name: "Upholstery", keywords: [] as typeof KEYWORDS },
    { name: "Drapery", keywords: [] as typeof KEYWORDS },
    { name: "Cushions", keywords: [] as typeof KEYWORDS },
    { name: "Slipcovers", keywords: [] as typeof KEYWORDS },
    { name: "Wall Coverings", keywords: [] as typeof KEYWORDS },
    { name: "Furniture", keywords: [] as typeof KEYWORDS },
    { name: "Soft Goods", keywords: [] as typeof KEYWORDS },
    { name: "Bedding", keywords: [] as typeof KEYWORDS },
    { name: "Tapestry", keywords: [] as typeof KEYWORDS },
  ];

  // Group keywords
  for (const kw of KEYWORDS) {
    let matched = false;
    for (const cat of categories) {
      if (kw.keyword.includes(cat.name)) {
        cat.keywords.push(kw);
        matched = true;
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-white/40">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/locations" className="hover:text-white transition-colors">Locations</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#d4af37]">{cityName} Directory</span>
        </nav>

        <header className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-[#d4af37]">
            Leslie's Weaving Studio
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold italic mb-6">
            Fabric Design &amp; Specifications in {cityName}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore all {KEYWORDS.length * 2} unique custom weave configurations and local location services available in {cityName}.
          </p>
          <div className="mt-4 text-sm text-white/40 italic">
            Serving {cityName} and surrounding areas: {cityDef.neighbors.join(", ")}
          </div>
        </header>

        <div className="space-y-16">
          {categories.map((category) => (
            <section key={category.name} className="space-y-6">
              <div className="border-b border-white/10 pb-3 flex justify-between items-baseline">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#d4af37]">
                  Custom {category.name} Weaves
                </h2>
                <span className="text-xs text-white/40 font-mono">
                  {category.keywords.length} specs
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.keywords.map((kw) => {
                  const locationSlug = `${citySlug}-${kw.slug}`;
                  return (
                    <div
                      key={kw.slug}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#d4af37]/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-base font-bold font-display text-white mb-2">
                          {kw.keyword}
                        </h3>
                        <p className="text-xs text-white/50 leading-relaxed mb-4">
                          Bespoke 100% cotton {kw.keywordShort} woven in days to your exact interior design specification.
                        </p>
                      </div>
                      <div className="flex gap-4 border-t border-white/5 pt-3 text-xs">
                        <Link
                          href={`/locations/${locationSlug}`}
                          className="text-[#d4af37] hover:underline font-semibold"
                        >
                          Location Page
                        </Link>
                        <span className="text-white/20">|</span>
                        <Link
                          href={`/fabric/${citySlug}/${kw.slug}`}
                          className="text-white/60 hover:text-white hover:underline"
                        >
                          Fabric Spec
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
