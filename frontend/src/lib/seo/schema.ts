const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visitsrilanka.com";

/**
 * schema.org structured data builders.
 *
 * Not wired into any page yet — the Destinations and Hotels detail pages
 * these are meant for don't exist in this build (see Architecture doc,
 * Phase 3/4). Drop `buildTouristDestinationSchema` into
 * `destinations/[slug]/page.tsx` and `buildHotelSchema` into
 * `hotels/[slug]/page.tsx` once those pages are built, rendered via the
 * <JsonLd> component in components/seo/JsonLd.tsx.
 */

export interface TouristDestinationSchemaInput {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  region: string;
}

export function buildTouristDestinationSchema(input: TouristDestinationSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: input.name,
    description: input.description,
    url: `${siteUrl}/destinations/${input.slug}`,
    ...(input.imageUrl && { image: input.imageUrl }),
    address: {
      "@type": "PostalAddress",
      addressRegion: input.region,
      addressCountry: "LK",
    },
  };
}

export interface HotelSchemaInput {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  region: string;
  priceRangeUsd: [number, number];
  ratingValue?: number;
  reviewCount?: number;
}

export function buildHotelSchema(input: HotelSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: input.name,
    description: input.description,
    url: `${siteUrl}/hotels/${input.slug}`,
    ...(input.imageUrl && { image: input.imageUrl }),
    address: {
      "@type": "PostalAddress",
      addressRegion: input.region,
      addressCountry: "LK",
    },
    priceRange: `$${input.priceRangeUsd[0]}-$${input.priceRangeUsd[1]}`,
    ...(input.ratingValue && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: input.ratingValue,
        reviewCount: input.reviewCount ?? 1,
      },
    }),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Visit Sri Lanka",
    url: siteUrl,
    description:
      "A modern tourism platform helping travelers discover Sri Lanka's beaches, wildlife, heritage sites, and mountains.",
    sameAs: [],
  };
}
