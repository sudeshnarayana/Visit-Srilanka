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

    if (!session) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const vehicles = await db
      .collection("vehicles")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(vehicles);

  } catch (err) {
    console.error("GET vehicles failed:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body?.id || !body?.name || !body?.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }


    const client = await clientPromise;
    const db = client.db();


    const existing = await db
      .collection("vehicles")
      .findOne({ id: body.id });


    if (existing) {
      return NextResponse.json(
        { error: "Vehicle already exists" },
        { status: 409 }
      );
    }


    const vehicle = {
      id: body.id,
      name: body.name,
      type: body.type,
      seats: Number(body.seats) || 0,
      dailyRateUsd: Number(body.dailyRateUsd) || 0,
      description: body.description ?? "",
      images: Array.isArray(body.images)
        ? body.images
        : [],
      includesDriver: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };


    const result = await db
      .collection("vehicles")
      .insertOne(vehicle);


    return NextResponse.json(
      {
        id: result.insertedId.toString()
      },
      {
        status: 201
      }
    );


  } catch (err) {

    console.error("POST vehicles failed:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request) {

  try {

    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }


    const body = await request.json();

    if (!body?._id) {
      return NextResponse.json(
        { error: "Missing _id" },
        { status: 400 }
      );
    }


    const { _id, ...updates } = body;


    const client = await clientPromise;
    const db = client.db();


    await db.collection("vehicles").updateOne(
      {
        _id: new ObjectId(_id)
      },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );


    return NextResponse.json({
      success: true
    });


  } catch (err) {

    console.error("PATCH vehicles failed:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {

  try {

    const session = await requireAdmin();

    if (!session) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }


    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");


    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }


    const client = await clientPromise;
    const db = client.db();


    await db.collection("vehicles").deleteOne(
      {
        _id: new ObjectId(id)
      }
    );


    return NextResponse.json({
      success: true
    });


  } catch (err) {

    console.error("DELETE vehicles failed:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}