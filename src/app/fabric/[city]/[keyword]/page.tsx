import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, KEYWORDS, getLocationPageBySlug } from "@/data/locations";
import ConsultationForm from "./ConsultationForm";
import seoOptimizations from "../../../../../seo_operations/seo-optimizations.json";

function SemanticParagraphs({ paragraphs }: { paragraphs: string[] }) {
  if (!paragraphs || paragraphs.length === 0) return null;
  return (
    <section className="py-16" style={{ background: "oklch(0.95 0.008 75)", borderTop: "1px solid oklch(0.87 0.015 65)" }}>
      <div className="container max-w-[1600px] mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: "oklch(0.22 0.025 55)" }}>Additional Insights & Standards</h2>
          {paragraphs.map((para: string, idx: number) => {
            if (para.startsWith('*') || para.startsWith('-')) {
              return (
                <ul key={idx} className="list-disc pl-6 space-y-2 mb-6" style={{ color: "oklch(0.35 0.02 58)" }}>
                  {para.split('\n').map((line: string, lIdx: number) => {
                    const cleanLine = line.replace(/^[\s*-]+/, '').trim();
                    if (!cleanLine) return null;
                    return <li key={lIdx}>{cleanLine}</li>;
                  })}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-lg leading-relaxed mb-6 last:mb-0" style={{ color: "oklch(0.35 0.02 58)" }}>
                {para.split('**').map((part: string, pIdx: number) => 
                  pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold" style={{ color: "oklch(0.22 0.025 55)" }}>{part}</strong> : part
                )}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Force Next.js to 404 any route not explicitly returned by generateStaticParams
export const dynamicParams = true;

export async function generateStaticParams() {
  // Generate first 300 combinations statically
  const params = [];
  let count = 0;
  for (const cityDef of CITIES) {
    const citySlug = cityDef.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    for (const kw of KEYWORDS) {
      params.push({
        city: citySlug,
        keyword: kw.slug,
      });
      count++;
      if (count === 300) return params;
    }
  }
  return params;
}

// Hero image matching the production site
const IMG_HERO_LOOM = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032508805/VPKxLBejXfnETyfxXYi5Qj/loom-front_5f9c7f9f.jpg";

function getShortTitle(keyword: string, city: string): string {
  const full = `${keyword} in ${city} | Leslie's Weaving Studio`;
  if (full.length <= 60) return full;
  
  const shortBrand = `${keyword} in ${city} | Leslie's Weaving`;
  if (shortBrand.length <= 60) return shortBrand;
  
  let cleanKw = keyword.startsWith("Custom ") ? keyword.substring(7) : keyword;
  const noCustomBrand = `${cleanKw} in ${city} | Leslie's Weaving`;
  if (noCustomBrand.length <= 60) return noCustomBrand;
  
  const minimalBrand = `${cleanKw} in ${city} | Leslie's`;
  if (minimalBrand.length <= 60) return minimalBrand;

  return minimalBrand.slice(0, 60);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; keyword: string }>;
}): Promise<Metadata> {
  const { city, keyword } = await params;
  const fullSlug = `${city}-${keyword}`;
  const pageData = getLocationPageBySlug(fullSlug);

  if (!pageData) {
    notFound();
  }

  const path = `/fabric/${city}/${keyword}`;
  const optimization = (seoOptimizations as any)[path];

  if (optimization) {
    return {
      title: optimization.title,
      description: optimization.metaDescription,
      alternates: {
        canonical: `https://www.lesliesweavingstudio.com${path}`,
      },
      openGraph: {
        title: optimization.title,
        description: optimization.metaDescription,
        url: `https://www.lesliesweavingstudio.com${path}`,
        type: "website",
        images: [{ url: IMG_HERO_LOOM }],
      },
      twitter: {
        card: "summary_large_image",
        title: optimization.title,
        description: optimization.metaDescription,
        images: [IMG_HERO_LOOM],
      },
    };
  }

  const title = getShortTitle(pageData.keyword, pageData.city);
  const description = `Discover bespoke 100% cotton ${pageData.keywordShort.toLowerCase()} in ${pageData.city}. Woven on our 72" Dobby loom with over 70 colors available for designers.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.lesliesweavingstudio.com/fabric/${city}/${keyword}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.lesliesweavingstudio.com/fabric/${city}/${keyword}`,
      type: "website",
      images: [{ url: IMG_HERO_LOOM }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [IMG_HERO_LOOM],
    },
  };
}

export default async function FabricLandingPage({
  params,
}: {
  params: Promise<{ city: string; keyword: string }>;
}) {
  const { city, keyword } = await params;
  const fullSlug = `${city}-${keyword}`;
  const pageData = getLocationPageBySlug(fullSlug);

  if (!pageData) {
    notFound();
  }

  const path = `/fabric/${city}/${keyword}`;
  const optimization = (seoOptimizations as any)[path];

  const displayCity = pageData.city;
  const displayKeyword = pageData.keyword;

  const visualizerUrl = "https://www.lesliesweavingstudio.com/studio";

  const pageDef = CITIES.find(c => c.city.toLowerCase() === pageData.city.toLowerCase());
  if (!pageDef) {
    notFound();
  }

  const neighborCities = pageDef.neighbors
    .map(name => CITIES.find(c => c.city.toLowerCase() === name.toLowerCase()))
    .filter((c): c is NonNullable<typeof c> => !!c);

  const displayH1 = optimization?.h1 || `Looking for ${displayKeyword.toLowerCase()} in ${displayCity}?`;

  return (
    <div className="w-full flex flex-col">
      {/* ── 1. Captured Introduction (Hero) ─────────────────────────────────── */}
      <section className="relative overflow-hidden flex flex-col justify-center" style={{ height: '100dvh', scrollSnapAlign: 'start' }}>
        <div className="absolute inset-0">
          <img src={IMG_HERO_LOOM} alt="Leslie's weaving loom" className="w-full h-full object-cover object-top" />
          {/* Very light base wash just to help the stats bar at the bottom */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 0%, transparent 60%, oklch(0.12 0.02 55 / 0.85) 100%)" }} />
        </div>

        <div className="relative container max-w-[1600px] mx-auto px-6 pt-20 sm:pt-24">
          <div className="max-w-3xl p-8 md:p-10 rounded-2xl backdrop-blur-xl shadow-2xl" style={{ background: "oklch(0.12 0.02 55 / 0.35)", border: "1px solid oklch(0.95 0.01 75 / 0.15)" }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "oklch(0.72 0.1 35)" }}>
              {displayCity} &middot; Est. 2012 &middot; American Made &middot; 100% Cotton
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold italic leading-tight mb-6 drop-shadow-lg" style={{ color: "white", textShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
              {displayH1}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed drop-shadow-md" style={{ color: "oklch(0.95 0.01 75)" }}>
              See what Leslie's Weaving Studio can do for your project. We weave bespoke 100% cotton fabric on a 72-inch computerized Dobby loom — available nowhere else in the Southeast.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0" style={{ background: "oklch(0.10 0.02 55 / 0.85)", backdropFilter: "blur(4px)", borderTop: "1px solid oklch(0.92 0.01 75 / 0.15)" }}>
          <div className="container max-w-[1600px] mx-auto px-6 py-3">
            <div className="grid grid-cols-6 gap-1">
              {[
                { num: '72"', label: "Max Width" },
                { num: "24", label: "Shafts" },
                { num: "76", label: "Drafts" },
                { num: "77", label: "Colors" },
                { num: `14,000+`, label: "Possibilities" },
                { num: "100%", label: "US Cotton" },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="text-lg sm:text-2xl font-bold font-display" style={{ color: "oklch(0.72 0.1 35)" }}>{num}</div>
                  <div className="text-[8px] sm:text-[10px] tracking-widest uppercase font-medium mt-0.5" style={{ color: "oklch(0.72 0.01 75)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. See what your fabrics would look like (SEO Copy) ───────────── */}
      <section className="flex flex-col justify-center" style={{ background: "oklch(0.975 0.008 75)", paddingTop: "100px", paddingBottom: "60px" }}>
        <div className="container max-w-[1600px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "oklch(0.52 0.13 35)" }}>
                The Capability
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-8" style={{ color: "oklch(0.22 0.025 55)" }}>
                See what your<br />fabrics would look like.
              </h2>
              <div className="w-12 h-0.5 mb-8" style={{ background: "oklch(0.52 0.13 35)" }} />

              <p className="text-lg leading-relaxed mb-6" style={{ color: "oklch(0.35 0.02 58)" }}>
                {pageData.bodyParagraph1}
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "oklch(0.35 0.02 58)" }}>
                {pageData.bodyParagraph2}
              </p>
              <p className="text-base leading-relaxed italic" style={{ color: "oklch(0.52 0.13 35)" }}>
                {pageData.closingSignal}
              </p>

              {/* Related Service Areas */}
              {neighborCities.length > 0 && (
                <div className="mt-12 pt-8 border-t" style={{ borderColor: "oklch(0.87 0.015 65)" }}>
                  <span className="text-xs font-semibold tracking-widest uppercase block mb-4" style={{ color: "oklch(0.52 0.13 35)" }}>
                    Related Service Areas
                  </span>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
                    {neighborCities.map((neighbor) => {
                      const neighborSlug = neighbor.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      return (
                        <Link 
                          key={neighbor.city}
                          href={`/fabric/${neighborSlug}/${keyword}`}
                          className="transition-colors hover:opacity-80 flex items-center gap-1"
                          style={{ color: "oklch(0.52 0.13 35)" }}
                        >
                          <span>{displayKeyword} in {neighbor.city}</span>
                          <span className="text-xs">&rarr;</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-sm shadow-md transition-transform hover:-translate-y-1" style={{ background: "white", border: "1px solid oklch(0.87 0.015 65)" }}>
                <h3 className="text-2xl font-display font-bold mb-3" style={{ color: "oklch(0.52 0.13 35)" }}>72-Inch Width</h3>
                <p className="text-base" style={{ color: "oklch(0.35 0.02 58)" }}>The only 72" Dobby loom in the Southeast. Leslie weaves 33% wider — full-width panels with no seams.</p>
              </div>
              <div className="p-8 rounded-sm shadow-md transition-transform hover:-translate-y-1" style={{ background: "white", border: "1px solid oklch(0.87 0.015 65)" }}>
                <h3 className="text-2xl font-display font-bold mb-3" style={{ color: "oklch(0.52 0.13 35)" }}>24-Shaft Complexity</h3>
                <p className="text-base" style={{ color: "oklch(0.35 0.02 58)" }}>Over 8,000 distinct weave structures. Most commercial looms top out at 8 shafts. This is where custom truly begins.</p>
              </div>
              <div className="p-8 rounded-sm shadow-md transition-transform hover:-translate-y-1" style={{ background: "white", border: "1px solid oklch(0.87 0.015 65)" }}>
                <h3 className="text-2xl font-display font-bold mb-3" style={{ color: "oklch(0.52 0.13 35)" }}>100% Cotton</h3>
                <p className="text-base" style={{ color: "oklch(0.35 0.02 58)" }}>Maurice Brassard & Fils — 77 colors, zero synthetic blends. Delivered in days, not months.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. The 3D Studio ────────────────────────────────────────────────── */}
      <section className="flex flex-col justify-center" style={{ background: "oklch(0.975 0.008 75)", paddingBottom: "100px" }}>
        <div className="container max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.52 0.13 35)" }}>
              Interactive Sandbox
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{ color: "oklch(0.22 0.025 55)" }}>
              Design Your {displayKeyword}
            </h2>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "oklch(0.35 0.02 58)" }}>
              Use our interactive 3D Studio to select furniture, apply custom patterns, and see exactly how your fabric will look before we begin weaving.
            </p>
          </div>

          <div className="w-full h-[750px] md:h-[850px] rounded-xl overflow-hidden border shadow-xl" style={{ borderColor: "oklch(0.87 0.015 65)", background: "white" }}>
            <iframe
              src={visualizerUrl}
              className="w-full h-full border-none bg-white"
              title="Leslie's Weaving 3D Configurator"
            />
          </div>
        </div>
      </section>

      {optimization?.semanticParagraphs && (
        <SemanticParagraphs paragraphs={optimization.semanticParagraphs} />
      )}

      {/* ── 4. A Call to Action (Dedicated Form) ───────────────────────────── */}
      <section className="py-24" style={{ background: "oklch(0.16 0.02 55)", borderTop: "1px solid oklch(0.87 0.015 65)" }}>
        <div className="container max-w-[1600px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="text-left">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "oklch(0.72 0.1 35)" }}>
                Next Steps
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold italic font-display leading-tight mb-6" style={{ color: "white" }}>
                Ready to put the fabric<br />in your hands?
              </h2>
              <ol className="text-lg mb-8 leading-relaxed list-decimal list-inside space-y-2" style={{ color: "oklch(0.88 0.01 75)" }}>
                <li>Create a fabric in the configurator</li>
                <li>Fill in the form</li>
                <li>We will call you to provide a unique sample</li>
              </ol>

              <p className="text-sm mt-8 font-semibold" style={{ color: "oklch(0.72 0.1 35)" }}>
                &#128222; Direct Line: (954) 253-7870
              </p>
            </div>

            <div className="w-full max-w-lg mx-auto lg:mx-0">
              <ConsultationForm />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
