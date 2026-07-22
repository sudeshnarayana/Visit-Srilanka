import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  const { default: clientPromise } = await import("../src/lib/mongodb");
  const { TRIP_DESTINATIONS } = await import("../src/data/trip-planner-destinations");

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("destinations");

  const existingCount = await collection.countDocuments();
  if (existingCount > 0) {
    console.log(`Skipping seed — ${existingCount} destinations already exist.`);
    process.exit(0);
  }

  const docs = TRIP_DESTINATIONS.map((d) => ({
    ...d,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await collection.insertMany(docs);
  console.log(`Seeded ${result.insertedCount} destinations.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});