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

    const plans = await db
      .collection("trip_plans")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const userIds = [...new Set(plans.map((p) => p.userId).filter(Boolean))];
    const users = await db
      .collection("users")
      .find(
        { _id: { $in: userIds.map((id) => new ObjectId(id)) } },
        { projection: { name: 1, email: 1 } }
      )
      .toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const enriched = plans.map((plan) => ({
      ...plan,
      owner: userMap.get(plan.userId) ?? null,
    }));

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("GET /api/admin/trip-plans failed:", err);
    return NextResponse.json({ error: String(err), stack: (err as Error)?.stack }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("trip_plans").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/trip-plans failed:", err);
    return NextResponse.json({ error: String(err), stack: (err as Error)?.stack }, { status: 500 });
  }
}