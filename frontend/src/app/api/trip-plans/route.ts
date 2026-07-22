import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const plans = await db
    .collection("trip_plans")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.days) {
    return NextResponse.json({ error: "Invalid itinerary payload" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("trip_plans").insertOne({
    userId: session.user.id,
    title: body.title,
    duration: body.duration,
    destinations: body.destinations,
    travelStyle: body.travelStyle,
    budgetTier: body.budget,
    days: body.days,
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
  await db.collection("trip_plans").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });

  return NextResponse.json({ success: true });
}