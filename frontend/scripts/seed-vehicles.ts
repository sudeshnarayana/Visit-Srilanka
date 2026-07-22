import { config } from "dotenv";
config({ path: ".env.local" });

const VEHICLES = [
  {
    id: "sedan-car",
    name: "Standard Sedan",
    type: "Car",
    seats: 4,
    dailyRateUsd: 35,
    description: "Comfortable air-conditioned car, ideal for couples or small families on paved roads.",
    images: [],
  },
  {
    id: "van-tourist",
    name: "Tourist Van",
    type: "Van",
    seats: 8,
    dailyRateUsd: 60,
    description: "Spacious van with luggage space, great for groups of up to 8.",
    images: [],
  },
  {
    id: "suv-4x4",
    name: "4x4 SUV",
    type: "SUV",
    seats: 5,
    dailyRateUsd: 75,
    description: "Rugged SUV suited for hill country roads and safari park access.",
    images: [],
  },
  {
    id: "minibus-group",
    name: "Group Minibus",
    type: "Minibus",
    seats: 14,
    dailyRateUsd: 95,
    description: "Large minibus for bigger groups travelling together.",
    images: [],
  },
];

async function seed() {
  const { default: clientPromise } = await import("../src/lib/mongodb");

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("vehicles");

  const existingCount = await collection.countDocuments();
  if (existingCount > 0) {
    console.log(`Skipping seed — ${existingCount} vehicles already exist.`);
    process.exit(0);
  }

  const docs = VEHICLES.map((v) => ({
    ...v,
    includesDriver: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await collection.insertMany(docs);
  console.log(`Seeded ${result.insertedCount} vehicles.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});