import Link from "next/link";
import { LOCATION_PAGES, LocationPage } from "@/data/locations";

export const dynamic = "force-static";

export const metadata = {
  title: "Studio Locations Directory | Leslie's Weaving",
  description: "Browse our South Florida service locations and bespoke fabric specifications. Seam-free 100% cotton handwoven fabric.",
};

export default function LocationsDirectoryPage() {
  // Group LOCATION_PAGES by County, and then by City.
  const counties: { [county: string]: { [city: string]: LocationPage[] } } = {};
  
  for (const page of LOCATION_PAGES) {
    const countyName = page.county || "South Florida";
    const cityName = page.city;
    
    if (!counties[countyName]) {
      counties[countyName] = {};
    }
    if (!counties[countyName][cityName]) {
      counties[countyName][cityName] = [];
    }
    counties[countyName][cityName].push(page);
  }
  
  // Sort counties for consistency
  const sortedCounties = Object.keys(counties).sort();
  
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
            const sortedCities = Object.keys(cities).sort();
            
            return (
              <section key={countyName} className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#d4af37]">
                    {countyName}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedCities.map((cityName) => {
                    const pages = cities[cityName];
                    
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
                            {pages.map((page) => {
                              const citySlug = page.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                              const keywordSlug = page.slug.substring(citySlug.length + 1);
                              
                              return (
                                <li key={page.slug} className="text-sm border-l-2 border-[#d4af37]/30 pl-3">
                                  <div className="font-semibold text-white/90">
                                    {page.keyword}
                                  </div>
                                  <div className="flex gap-4 mt-1 text-xs">
                                    <Link 
                                      href={`/locations/${page.slug}`}
                                      className="text-[#d4af37] hover:underline"
                                    >
                                      Location Page
                                    </Link>
                                    <span className="text-white/20">|</span>
                                    <Link 
                                      href={`/fabric/${citySlug}/${keywordSlug}`}
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
