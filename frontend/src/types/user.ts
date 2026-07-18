/**
 * User & Auth data model.
 * Kept as plain interfaces so this mirrors the MongoDB `users` collection
 * (see docs/database.md) and a future Spring Boot UserDto without frontend
 * code changing — see Architecture doc §10.
 */

export type UserRole = "TOURIST" | "HOTEL_PARTNER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  country?: string;
  avatarUrl?: string;
  role: UserRole;
  memberSince: string; // ISO date
}

/** Drives auth-aware UI (nav, profile page, route guards) via useAuth() / Auth.js. */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterDetails {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
}

export type SocialProvider = "google" | "facebook";

export interface FavoriteDestination {
  id: string;
  name: string;
  category: "Beach" | "Wildlife" | "Heritage" | "Mountains";
  region: string;
  savedAt: string;
}

export interface FavoriteHotel {
  id: string;
  name: string;
  location: string;
  pricePerNightUsd: number;
  rating: number;
  savedAt: string;
}

export interface SavedTrip {
  id: string;
  title: string;
  duration: number;
  destinations: string[];
  travelStyle: string;
  createdAt: string;
}

export interface TravelHistoryEntry {
  id: string;
  destination: string;
  visitedOn: string;
  note?: string;
}
