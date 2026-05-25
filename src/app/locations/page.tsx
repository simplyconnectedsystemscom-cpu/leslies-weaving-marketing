import Link from "next/link";
import { CITIES, KEYWORDS } from "@/data/locations";

export const dynamic = "force-static";

export const metadata = {
  title: "Studio Locations Directory | Leslie's Weaving",
  description: "Browse our South Florida service locations and bespoke fabric specifications. Seam-free 100% cotton handwoven fabric.",
};

export default function LocationsDirectoryPage() {
  // Group CITIES by County
  const counties: { [county: string]: typeof CITIES } = {};
  
  for (const city of CITIES) {
    const countyName = city.county || "South Florida";
    if (!counties[countyName]) {
      counties[countyName] = [];
    }
    counties[countyName].push(city);
  }
  
  // Sort counties for consistency
  const sortedCounties = Object.keys(counties).sort();
  
  // Display only the first 5 keywords per city to prevent DOM bloat while keeping links crawlable
  const visibleKeywords = KEYWORDS.slice(0, 5);
  
  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-[#d4af37]">
            Leslie's Weaving Studio
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold italic mb-6">
            Our Service Locations
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Providing handwoven, 100% cotton fabric with 24-shaft complexity to designers across South Florida. Select a location below to view local services and specifications.
          </p>
        </header>

        <div className="space-y-16">
          {sortedCounties.map((countyName) => {
            const cities = counties[countyName];
            const sortedCities = [...cities].sort((a, b) => a.city.localeCompare(b.city));
            
            return (
              <section key={countyName} className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#d4af37]">
                    {countyName}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedCities.map((city) => {
                    const cityName = city.city;
                    const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    
                    return (
                      <div 
                        key={cityName}
                        className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#d4af37]/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-xl font-bold mb-4 font-display text-white">
                            {cityName}
                          </h3>
                          
                          <ul className="space-y-4">
                            {visibleKeywords.map((kw) => {
                              const pageSlug = `${citySlug}-${kw.slug}`;
                              
                              return (
                                <li key={kw.slug} className="text-sm border-l-2 border-[#d4af37]/30 pl-3">
                                  <div className="font-semibold text-white/90">
                                    {kw.keyword}
                                  </div>
                                  <div className="flex gap-4 mt-1 text-xs">
                                    <Link 
                                      href={`/locations/${pageSlug}`}
                                      className="text-[#d4af37] hover:underline"
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
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
