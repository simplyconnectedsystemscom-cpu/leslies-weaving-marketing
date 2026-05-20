import {
  TRADE_MODIFIERS, TRADE_CUSTOMIZATION, TRADE_PRODUCTS,
  FURNITURE_CUSTOMIZATION, FURNITURE_OBJECTS, FURNITURE_PRODUCTS,
  INTERIOR_MODIFIERS, INTERIOR_OBJECTS, INTERIOR_PRODUCTS,
  HOSPITALITY_MODIFIERS, HOSPITALITY_VENUES, HOSPITALITY_PRODUCTS
} from './national-keywords';

export interface NationalPage {
  matrix: string;
  slug: string;
  title: string;
  modifier: string;
  customization: string;
  product: string;
  description: string;
  body1: string;
  body2: string;
}

function generateSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function generateTradePages(): NationalPage[] {
  const pages: NationalPage[] = [];
  for (const mod of TRADE_MODIFIERS) {
    for (const cust of TRADE_CUSTOMIZATION) {
      for (const prod of TRADE_PRODUCTS) {
        const title = `${mod} ${cust} ${prod}`;
        const slug = generateSlug(title);
        pages.push({
          matrix: 'trade',
          slug,
          title,
          modifier: mod,
          customization: cust,
          product: prod,
          description: `Leslie's Weaving Studio produces ${title.toLowerCase()} for the interior design and architectural trades. 100% cotton, 24-shaft complexity, woven in Florida.`,
          body1: `For designers and architects specifying ${mod.toLowerCase()} materials, our ${cust.toLowerCase()} ${prod.toLowerCase()} delivers uncompromising quality. Unlike standard trade showrooms, Leslie's Weaving Studio works directly with you to develop exclusive patterns and colorways on our 72-inch computerized Dobby loom in South Florida.`,
          body2: `Whether you require a single yard for a strike-off or a full production run for a hospitality suite, every yard of our ${prod.toLowerCase()} is handwoven to your exact specifications. With 77 colors of Maurice Brassard 100% North American cotton, your ${cust.toLowerCase()} specification will remain exclusive to your firm.`
        });
      }
    }
  }
  return pages;
}

function generateFurniturePages(): NationalPage[] {
  const pages: NationalPage[] = [];
  for (const cust of FURNITURE_CUSTOMIZATION) {
    for (const obj of FURNITURE_OBJECTS) {
      for (const prod of FURNITURE_PRODUCTS) {
        const title = `${cust} ${obj} ${prod}`;
        const slug = generateSlug(title);
        pages.push({
          matrix: 'furniture',
          slug,
          title,
          modifier: cust,
          customization: obj,
          product: prod,
          description: `Bespoke and ${cust.toLowerCase()} ${obj.toLowerCase()} ${prod.toLowerCase()} woven to order. Exclusive luxury textiles for high-end furniture makers.`,
          body1: `High-end furniture fabrication requires textiles that match the craftsmanship of the frame. Our ${cust.toLowerCase()} ${obj.toLowerCase()} ${prod.toLowerCase()} is designed specifically for artisanal furniture makers and luxury upholstery workrooms. Leslie's Weaving Studio produces heavy-weight, highly durable 100% cotton textiles on our 72-inch loom.`,
          body2: `Because we weave to order, your ${obj.toLowerCase()} ${prod.toLowerCase()} can be engineered with the exact repeat and colorway required for your piece, eliminating awkward seams and generic patterns. Elevate your ${cust.toLowerCase()} furniture with textiles that cannot be sourced anywhere else.`
        });
      }
    }
  }
  return pages;
}

function generateInteriorPages(): NationalPage[] {
  const pages: NationalPage[] = [];
  for (const mod of INTERIOR_MODIFIERS) {
    for (const obj of INTERIOR_OBJECTS) {
      for (const prod of INTERIOR_PRODUCTS) {
        const title = `${mod} ${obj} ${prod}`;
        const slug = generateSlug(title);
        pages.push({
          matrix: 'interior',
          slug,
          title,
          modifier: mod,
          customization: obj,
          product: prod,
          description: `Exclusive ${mod.toLowerCase()} ${obj.toLowerCase()} ${prod.toLowerCase()} handwoven in South Florida for discerning residential and commercial projects.`,
          body1: `Modern interior architecture demands textiles that transcend standard showroom offerings. When outfitting an exclusive living space, our ${mod.toLowerCase()} ${obj.toLowerCase()} ${prod.toLowerCase()} provides a truly bespoke 100% cotton solution. Ideal for custom seating, drapery, and unique architectural focal points.`,
          body2: `Woven in South Florida for the nation's top interior practices, our studio understands the exacting standards of luxury design. Every yard of our ${obj.toLowerCase()} ${prod.toLowerCase()} is hand-crafted at 72-inches wide, allowing for seamless ${mod.toLowerCase()} applications on oversized furniture and expansive window treatments.`
        });
      }
    }
  }
  return pages;
}

function generateHospitalityPages(): NationalPage[] {
  const pages: NationalPage[] = [];
  for (const mod of HOSPITALITY_MODIFIERS) {
    for (const venue of HOSPITALITY_VENUES) {
      for (const prod of HOSPITALITY_PRODUCTS) {
        const title = `${mod} ${venue} ${prod}`;
        const slug = generateSlug(title);
        pages.push({
          matrix: 'hospitality',
          slug,
          title,
          modifier: mod,
          customization: venue,
          product: prod,
          description: `Contract-grade and ${mod.toLowerCase()} ${venue.toLowerCase()} ${prod.toLowerCase()} for commercial interiors. Handwoven luxury for exclusive venues.`,
          body1: `For exclusive commercial and hospitality spaces, standard commercial textiles often lack warmth and character. Our ${mod.toLowerCase()} ${venue.toLowerCase()} ${prod.toLowerCase()} bridges the gap between high-traffic durability and bespoke luxury. Woven on a 72-inch Dobby loom, we produce yardage specifically tailored for commercial installations.`,
          body2: `From boutique ${venue.toLowerCase()} lobbies to exclusive dining rooms, your project demands textiles that reinforce the brand's unique identity. Leslie's Weaving Studio partners with commercial designers to create ${mod.toLowerCase()} ${prod.toLowerCase()} in exact brand colorways, delivering a proprietary look that guests will remember.`
        });
      }
    }
  }
  return pages;
}

export const NATIONAL_PAGES: NationalPage[] = [
  ...generateTradePages(),
  ...generateFurniturePages(),
  ...generateInteriorPages(),
  ...generateHospitalityPages()
];

export const TOTAL_NATIONAL_PAGES = NATIONAL_PAGES.length;
