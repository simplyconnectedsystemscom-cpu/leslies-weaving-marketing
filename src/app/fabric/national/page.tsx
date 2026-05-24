import Link from "next/link";
import { NATIONAL_PAGES } from "@/data/national-pages";

export const dynamic = "force-static";

export const metadata = {
  title: "National Fabric Collections Directory | Leslie's Weaving Studio",
  description: "Browse our nationwide bespoke fabric specifications. Seam-free 100% cotton handwoven fabric for trade, hospitality, furniture, and interiors.",
};

export default function NationalDirectoryPage() {
  // Group pages by matrix
  const groups: { [matrix: string]: typeof NATIONAL_PAGES } = {
    trade: [],
    furniture: [],
    interior: [],
    hospitality: [],
  };

  for (const page of NATIONAL_PAGES) {
    if (groups[page.matrix]) {
      groups[page.matrix].push(page);
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <Link href="/locations" className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] hover:underline mb-4 block">
            &larr; Back to locations directory
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold italic mb-6">
            National Fabric Directory
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore our curated specification guides for bespoke, handwoven 100% cotton fabrics, structured by industry application.
          </p>
        </header>

        <div className="space-y-16">
          {Object.entries(groups).map(([matrix, pages]) => (
            <section key={matrix} className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#d4af37] capitalize">
                  {matrix} Collections ({pages.length} Specifications)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto border border-white/10 p-6 bg-white/[0.01] rounded-xl scrollbar-thin scrollbar-thumb-[#d4af37]/30">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/fabric/national/${page.matrix}/${page.slug}`}
                    className="text-sm text-white/60 hover:text-[#d4af37] hover:underline truncate"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
