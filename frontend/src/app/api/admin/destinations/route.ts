import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const client = await clientPromise;
    const db = client.db();
    const destinations = await db
      .collection("destinations")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(destinations);
  } catch (err) {
    console.error("GET /api/admin/destinations failed:", err);
    return NextResponse.json({ error: String(err), stack: (err as Error)?.stack }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body?.id || !body?.name || !body?.category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const existing = await db.collection("destinations").findOne({ id: body.id });
  if (existing) {
    return NextResponse.json({ error: "A destination with this id already exists" }, { status: 409 });
  }

  const doc = {
    id: body.id,
    name: body.name,
    region: body.region ?? "",
    category: body.category,
    description: body.description ?? "",
    activities: Array.isArray(body.activities) ? body.activities : [],
    imageUrl: body.imageUrl ?? null,
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("destinations").insertOne(doc);
  return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body?._id) {
    return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  }

  const { _id, ...updates } = body;

  const client = await clientPromise;
  const db = client.db();
  await db.collection("destinations").updateOne(
    { _id: new ObjectId(_id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  await db.collection("destinations").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}