import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import clientPromise from "@/lib/mongodb";
import { registerSchema } from "@/lib/validations/auth";

/**
 * Auth.js's Credentials provider has no built-in "sign up" — this route is
 * that missing piece. LoginForm/RegisterForm never talk to MongoDB
 * directly (no client-side DB access exists for MongoDB, unlike Supabase's
 * RLS-protected REST layer), so every write goes through a route like this.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password, country } = parsed.data;

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await users.insertOne({
    name,
    email,
    passwordHash,
    country,
    role: "TOURIST",
    createdAt: new Date(),
  });

  return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
}
