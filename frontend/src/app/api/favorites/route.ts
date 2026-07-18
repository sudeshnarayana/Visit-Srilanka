import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const favorites = await db
    .collection("favorites")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.type || (body.type !== "destination" && body.type !== "hotel")) {
    return NextResponse.json({ error: "type must be 'destination' or 'hotel'" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("favorites").insertOne({
    userId: session.user.id,
    type: body.type,
    destinationId: body.type === "destination" ? body.destinationId : null,
    hotelId: body.type === "hotel" ? body.hotelId : null,
    createdAt: new Date(),
  });

  return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  // Scoped to userId so one user can never delete another's favorite by
  // guessing an id — this is the MongoDB equivalent of a Supabase RLS policy.
  await db.collection("favorites").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  return NextResponse.json({ success: true });
}
