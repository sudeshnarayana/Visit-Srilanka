import type { Document, WithId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import type { Destination, DestinationCategory } from "@/types/destination";

/**
 * Destinations service layer — MongoDB-backed.
 *
 * NOTE: the Destinations *page/UI* (listing + detail pages, DestinationCard,
 * filters) was never actually built — only Trip Planner and Budget
 * Calculator were. These functions exist so that module has a real data
 * layer the moment the UI is built; they query the `destinations`
 * collection defined in docs/database.md. Server-side only (no "use
 * client") — call from Server Components or API routes.
 */

function mapDoc(doc: WithId<Document>): Destination {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    region: doc.region,
    description: doc.description,
    imageUrl: doc.imageUrl ?? null,
    activities: doc.activities ?? [],
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
  };
}

export async function getDestinations(category?: DestinationCategory): Promise<Destination[]> {
  const client = await clientPromise;
  const db = client.db();
  const filter = category ? { category } : {};
  const docs = await db.collection("destinations").find(filter).sort({ name: 1 }).toArray();
  return docs.map(mapDoc);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const client = await clientPromise;
  const db = client.db();
  const doc = await db.collection("destinations").findOne({ slug });
  return doc ? mapDoc(doc) : null;
}

export async function searchDestinations(query: string): Promise<Destination[]> {
  const client = await clientPromise;
  const db = client.db();
  const docs = await db
    .collection("destinations")
    .find({ name: { $regex: query, $options: "i" } })
    .sort({ name: 1 })
    .toArray();
  return docs.map(mapDoc);
}
