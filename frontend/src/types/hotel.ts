export type HotelTier = "Budget" | "Standard" | "Luxury";

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  location: string;
  tier: HotelTier;
  pricePerNightUsd: number;
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
  amenities: string[];
  createdAt: string;
}
