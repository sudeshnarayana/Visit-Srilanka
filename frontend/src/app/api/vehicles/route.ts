import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const vehicles = await db.collection("vehicles").find({}).sort({ dailyRateUsd: 1 }).toArray();

  return NextResponse.json(vehicles);
}