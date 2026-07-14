export interface TripDestination {
  id: string;
  name: string;
  region: string;
  category: "Heritage" | "Wildlife" | "Beach" | "Mountains";
  description: string;
  activities: string[];
}

/**
 * Curated set for the Trip Planner wizard. This intentionally overlaps
 * with (but does not import from) the Destinations module's own data —
 * that module owns full listing/detail content; this is just the subset
 * of names + sample activities needed to generate a plausible itinerary.
 */
export const TRIP_DESTINATIONS: TripDestination[] = [
  {
    id: "sigiriya",
    name: "Sigiriya",
    region: "Central Province",
    category: "Heritage",
    description: "Ancient rock fortress rising above the central plains.",
    activities: [
      "Visit Lion Rock",
      "Village tour",
      "Sigiriya Museum",
      "Pidurangala Rock sunrise hike",
    ],
  },
  {
    id: "ella",
    name: "Ella",
    region: "Uva Province",
    category: "Mountains",
    description: "Hill-country town famous for tea, trains, and viewpoints.",
    activities: [
      "Nine Arches Bridge",
      "Little Adam's Peak hike",
      "Ella Rock trek",
      "Tea plantation walk",
    ],
  },
  {
    id: "kandy",
    name: "Kandy",
    region: "Central Province",
    category: "Heritage",
    description: "Sacred hill capital and cultural heart of the island.",
    activities: [
      "Temple of the Tooth",
      "Cultural dance show",
      "Royal Botanical Gardens",
      "Kandy Lake walk",
    ],
  },
  {
    id: "galle",
    name: "Galle",
    region: "Southern Province",
    category: "Heritage",
    description: "Colonial-era fort city on the southwest coast.",
    activities: [
      "Galle Fort walking tour",
      "Lighthouse viewpoint",
      "Dutch Reformed Church",
      "Rampart sunset walk",
    ],
  },
  {
    id: "mirissa",
    name: "Mirissa",
    region: "Southern Province",
    category: "Beach",
    description: "Palm-lined beach town known for whale watching.",
    activities: [
      "Whale watching boat trip",
      "Coconut Tree Hill",
      "Beach relaxation",
      "Snorkeling at the reef",
    ],
  },
  {
    id: "yala",
    name: "Yala",
    region: "Southern Province",
    category: "Wildlife",
    description: "Sri Lanka's most visited national park, known for leopards.",
    activities: [
      "Morning safari drive",
      "Leopard tracking",
      "Bird watching",
      "Evening safari drive",
    ],
  },
];

export function getTripDestinationByName(name: string): TripDestination | undefined {
  return TRIP_DESTINATIONS.find((d) => d.name === name);
}
