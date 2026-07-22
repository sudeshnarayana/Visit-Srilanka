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
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const client = await clientPromise;
  const db = client.db();
  const users = await db
    .collection("users")
    .find({}, { projection: { name: 1, email: 1, role: 1, country: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(users);
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body?._id || !body?.role) {
    return NextResponse.json({ error: "Missing _id or role" }, { status: 400 });
  }

  const allowedRoles = ["TOURIST", "HOTEL_PARTNER", "ADMIN"];
  if (!allowedRoles.includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent an admin from demoting themselves and getting locked out
  if (body._id === session.user.id && body.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You can't change your own admin role" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db();
  await db.collection("users").updateOne(
    { _id: new ObjectId(body._id) },
    { $set: { role: body.role } }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Prevent an admin from deleting their own account via this panel
  if (id === session.user.id) {
    return NextResponse.json(
      { error: "You can't delete your own account here" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db();
  await db.collection("users").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}