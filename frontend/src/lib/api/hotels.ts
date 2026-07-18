import type { Document, WithId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import type { Hotel, HotelTier } from "@/types/hotel";

/**
 * Hotels service layer — MongoDB-backed.
 * Same caveat as lib/api/destinations.ts: the Hotels UI module wasn't
 * actually built in this project yet, but this data layer is ready for it.
 */

function mapDoc(doc: WithId<Document>): Hotel {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    location: doc.location,
    tier: doc.tier,
    pricePerNightUsd: doc.pricePerNightUsd,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    imageUrl: doc.imageUrl ?? null,
    amenities: doc.amenities ?? [],
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
  };
}

export async function getHotels(tier?: HotelTier): Promise<Hotel[]> {
  const client = await clientPromise;
  const db = client.db();
  const filter = tier ? { tier } : {};
  const docs = await db.collection("hotels").find(filter).sort({ rating: -1 }).toArray();
  return docs.map(mapDoc);
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const client = await clientPromise;
  const db = client.db();
  const doc = await db.collection("hotels").findOne({ slug });
  return doc ? mapDoc(doc) : null;
}

export async function getHotelsNearDestination(region: string): Promise<Hotel[]> {
  const client = await clientPromise;
  const db = client.db();
  const docs = await db
    .collection("hotels")
    .find({ location: region })
    .sort({ rating: -1 })
    .toArray();
  return docs.map(mapDoc);
}
