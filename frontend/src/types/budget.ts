export type AccommodationType = "Budget hotel" | "Standard hotel" | "Luxury hotel";

export type TransportType = "Public Transport" | "Rental Car" | "Private Driver" | "Taxi";

export type FoodType = "Budget meals" | "Normal meals" | "Luxury dining";

export type ActivityType = "Entrance fees" | "Tours" | "Experiences";

export type Currency = "USD" | "LKR";

export interface BudgetInputs {
  travelers: number;
  days: number;
  accommodation: AccommodationType;
  transport: TransportType;
  food: FoodType;
  activities: ActivityType[];
  currency: Currency;
}

export interface BudgetBreakdown {
  accommodation: number;
  transport: number;
  food: number;
  activities: number;
  total: number;
  currency: Currency;
}
