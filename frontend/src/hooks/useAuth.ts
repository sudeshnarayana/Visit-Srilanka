"use client";

import { useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import type { LoginCredentials, RegisterDetails, User } from "@/types/user";

/**
 * Auth.js-backed replacement for the old Supabase useAuth.
 * Same public shape (`user`, `isAuthenticated`, `isLoading`, `login`,
 * `register`, `logout`) so LoginForm/RegisterForm/Header/ProfilePageClient
 * needed no changes beyond RegisterForm dropping the email-confirmation
 * branch (MongoDB/Credentials auth has no built-in email verification —
 * see docs/architecture.md for that as a future improvement).
 */
export function useAuth() {
  const { data: session, status } = useSession();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "Traveler",
        email: session.user.email ?? "",
        country: session.user.country,
        role: (session.user.role as User["role"]) ?? "TOURIST",
        // Auth.js's session doesn't carry createdAt — good enough for
        // display purposes until profile data is fetched from Mongo directly.
        memberSince: new Date().toISOString(),
      }
    : null;

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      throw new Error("Invalid email or password");
    }
  }, []);

  const register = useCallback(async (details: RegisterDetails) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(body.error ?? "Registration failed");
    }

    // Registration doesn't log the user in by itself — sign in immediately
    // after so the flow feels the same as before (register -> /profile).
    const result = await signIn("credentials", {
      email: details.email,
      password: details.password,
      redirect: false,
    });
    if (result?.error) {
      throw new Error("Account created, but automatic sign-in failed — please log in.");
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    register,
    logout,
  };
}
