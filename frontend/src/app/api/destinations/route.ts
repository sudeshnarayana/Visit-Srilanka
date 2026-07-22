import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const destinations = await db
    .collection("destinations")
    .find({})
    .sort({ name: 1 })
    .toArray();

  return NextResponse.json(destinations);
}