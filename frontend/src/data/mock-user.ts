import type {
  FavoriteDestination,
  FavoriteHotel,
  SavedTrip,
  TravelHistoryEntry,
  User,
} from "@/types/user";

export const MOCK_USER: User = {
  id: "user-demo-1",
  name: "Amaya Perera",
  email: "amaya.perera@example.com",
  country: "Sri Lanka",
  role: "TOURIST",
  memberSince: "2025-11-02",
};

export const MOCK_FAVORITE_DESTINATIONS: FavoriteDestination[] = [
  { id: "fd-1", name: "Sigiriya", category: "Heritage", region: "Central Province", savedAt: "2026-01-14" },
  { id: "fd-2", name: "Mirissa", category: "Beach", region: "Southern Province", savedAt: "2026-02-02" },
  { id: "fd-3", name: "Yala National Park", category: "Wildlife", region: "Southern Province", savedAt: "2026-03-10" },
];

export const MOCK_FAVORITE_HOTELS: FavoriteHotel[] = [
  { id: "fh-1", name: "Cinnamon Wild Yala", location: "Yala", pricePerNightUsd: 180, rating: 4.6, savedAt: "2026-03-10" },
  { id: "fh-2", name: "Amangalla", location: "Galle", pricePerNightUsd: 450, rating: 4.9, savedAt: "2026-02-20" },
];

export const MOCK_SAVED_TRIPS: SavedTrip[] = [
  {
    id: "trip-1",
    title: "7-Day Adventure Trip: Sigiriya & 2 more",
    duration: 7,
    destinations: ["Sigiriya", "Ella", "Yala"],
    travelStyle: "Adventure",
    createdAt: "2026-04-01",
  },
  {
    id: "trip-2",
    title: "5-Day Relaxation Trip: Mirissa & 1 more",
    duration: 5,
    destinations: ["Mirissa", "Galle"],
    travelStyle: "Relaxation",
    createdAt: "2026-05-18",
  },
];

export const MOCK_TRAVEL_HISTORY: TravelHistoryEntry[] = [
  { id: "hist-1", destination: "Kandy", visitedOn: "2025-12-20", note: "Visited during the Esala Perahera festival." },
  { id: "hist-2", destination: "Nuwara Eliya", visitedOn: "2026-01-15" },
  { id: "hist-3", destination: "Galle", visitedOn: "2026-02-22", note: "Stayed inside the fort walls." },
];
