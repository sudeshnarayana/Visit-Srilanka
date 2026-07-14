import type { AccommodationType, ActivityType, FoodType, TransportType } from "@/types/budget";

/**
 * Approximate exchange rate — not a live rate. Update this constant (or
 * later swap it for a real FX API call) as needed; it exists so LKR
 * figures are roughly in the right range rather than a live guarantee.
 */
export const USD_TO_LKR_RATE = 300;

/** USD per room, per night. Rooms are calculated as ceil(travelers / 2). */
export const ACCOMMODATION_RATES: Record<AccommodationType, number> = {
  "Budget hotel": 15,
  "Standard hotel": 35,
  "Luxury hotel": 90,
};

/** USD per day, flat for the traveling group (not per traveler). */
export const TRANSPORT_RATES: Record<TransportType, number> = {
  "Public Transport": 5,
  "Rental Car": 30,
  "Private Driver": 55,
  Taxi: 40,
};

/** USD per traveler, per day. */
export const FOOD_RATES: Record<FoodType, number> = {
  "Budget meals": 8,
  "Normal meals": 18,
  "Luxury dining": 45,
};

/** USD per traveler, per day — summed across whichever activity types are selected. */
export const ACTIVITY_RATES: Record<ActivityType, number> = {
  "Entrance fees": 3,
  Tours: 10,
  Experiences: 18,
};
