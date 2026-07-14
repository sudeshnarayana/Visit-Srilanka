export type DestinationCategory = "Beach" | "Wildlife" | "Heritage" | "Mountains";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  category: DestinationCategory;
  region: string;
  description: string;
  imageUrl: string | null;
  activities: string[];
  createdAt: string;
}
