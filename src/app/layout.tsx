import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Leslie's Weaving Studio",
  description: "Fabric no one else can make. Bespoke 100% cotton fabric for interior designers and fashion houses.",
};

export default function LesliesWeavingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen ${playfair.variable} ${dmSans.variable} font-[family-name:var(--font-dm-sans)] flex flex-col`}
        style={{ background: "oklch(0.975 0.008 75)", color: "oklch(0.22 0.025 55)" }}
      >
      <style>{`
        .font-display { font-family: var(--font-playfair), Georgia, serif; }
        
        .nav-link {
          position: relative;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: oklch(0.52 0.13 35);
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>

      {/* ── Brand Header (Scrolled State Style for static landing pages) ────────────────────────────────────────────────── */}
      <header 
        className="w-full sticky top-0 z-50 transition-all duration-300"
        style={{
          background: "oklch(0.975 0.008 75 / 0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.87 0.015 65)",
          padding: "0.875rem 0"
        }}
      >
        <div className="container max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2">
            <span 
              className="text-xl font-bold font-display tracking-tight"
              style={{ color: "oklch(0.22 0.025 55)", letterSpacing: "-0.01em" }}
            >
              Leslie's Weaving
            </span>
            <span 
              className="hidden sm:inline text-xs tracking-widest uppercase font-semibold"
              style={{ color: "oklch(0.52 0.13 35)" }}
            >
              Studio
            </span>
          </Link>

          {/* Desktop Navigation (Removed for Landing Page Focus) */}
          <nav className="hidden lg:flex items-center gap-8"></nav>

        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      </body>
    </html>
  );
}
