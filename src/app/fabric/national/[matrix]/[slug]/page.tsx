import { NATIONAL_PAGES } from '@/data/national-pages';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateStaticParams() {
  return NATIONAL_PAGES.map((page) => ({
    matrix: page.matrix,
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matrix: string; slug: string }>;
}): Promise<Metadata> {
  const { matrix, slug } = await params;
  const page = NATIONAL_PAGES.find((p) => p.matrix === matrix && p.slug === slug);
  
  if (!page) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${page.title} | Leslie's Weaving Studio`,
    description: page.description,
    alternates: {
      canonical: `https://www.lesliesweavingstudio.com/fabric/national/${matrix}/${slug}`,
    },
  };
}

export default async function NationalPage({
  params,
}: {
  params: Promise<{ matrix: string; slug: string }>;
}) {
  const { matrix, slug } = await params;
  const page = NATIONAL_PAGES.find((p) => p.matrix === matrix && p.slug === slug);
  
  if (!page) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800">
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="mb-12">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors">
            &larr; Back to Studio
          </Link>
        </div>
        
        <header className="mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-stone-500 mb-4 block">
            {page.matrix} specification
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-8">
            {page.title}
          </h1>
          <div className="h-px w-24 bg-stone-300"></div>
        </header>

        <div className="prose prose-stone prose-lg max-w-none">
          <p className="lead text-xl md:text-2xl font-light text-stone-600 mb-8 leading-relaxed">
            {page.body1}
          </p>
          <p className="text-lg text-stone-600 mb-12 leading-relaxed">
            {page.body2}
          </p>
          
          <div className="bg-stone-100 p-8 md:p-12 mt-16 rounded-sm border border-stone-200">
            <h2 className="text-2xl font-light mb-4">Discuss your {page.product.toLowerCase()} commission</h2>
            <p className="text-stone-600 mb-8">
              We work directly with designers and fabricators nationwide. Contact the studio to discuss your upcoming project requirements.
            </p>
            <Link href="/" className="inline-block bg-stone-900 text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-stone-800 transition-colors">
              Contact The Studio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
