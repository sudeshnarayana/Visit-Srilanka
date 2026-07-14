"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { AuthState, LoginCredentials, RegisterDetails, User } from "@/types/user";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function mapSupabaseUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  created_at: string;
}): User {
  return {
    id: supabaseUser.id,
    name: (supabaseUser.user_metadata?.name as string) ?? "Traveler",
    email: supabaseUser.email ?? "",
    country: supabaseUser.user_metadata?.country as string | undefined,
    role: (supabaseUser.user_metadata?.role as User["role"]) ?? "TOURIST",
    memberSince: supabaseUser.created_at,
  };
}

/**
 * Real Supabase Auth integration (Phase 9) — replaces the Phase 6 mock.
 * Same public shape (`user`, `isAuthenticated`, `login`, `register`,
 * `logout`) so LoginForm/RegisterForm/ProfilePageClient/Header needed no
 * changes.
 *
 * Guarded: if NEXT_PUBLIC_SUPABASE_URL/ANON_KEY aren't set (e.g. during
 * local dev before Supabase is provisioned), this never constructs a real
 * Supabase client — the Header and every other page that calls useAuth()
 * would otherwise throw on render, since supabase-js validates the URL
 * synchronously in its constructor. Instead it resolves to a clean
 * "signed out, not configured" state, and login/register surface a clear
 * error instead of a blank-page crash.
 */
export function useAuth() {
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), []);

  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: isSupabaseConfigured,
  });

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ? mapSupabaseUser(session.user) : null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ? mapSupabaseUser(session.user) : null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const login = useCallback(
    async ({ email, password }: LoginCredentials) => {
      if (!supabase) {
        throw new Error(
          "Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see docs/database.md)."
        );
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
      const user = mapSupabaseUser(data.user);
      setState({ user, isAuthenticated: true, isLoading: false });
      return user;
    },
    [supabase]
  );

  const register = useCallback(
    async ({ name, email, password, country }: RegisterDetails) => {
      if (!supabase) {
        throw new Error(
          "Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see docs/database.md)."
        );
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, country, role: "TOURIST" } },
      });
      if (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
      // If email confirmation is required, `data.user` exists but there's
      // no session yet — RegisterForm shows a "check your email" notice
      // rather than assuming the user is logged in.
      const user = data.user ? mapSupabaseUser(data.user) : null;
      setState({ user, isAuthenticated: !!data.session, isLoading: false });
      if (!user) throw new Error("Registration incomplete — no user returned.");
      return user;
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, [supabase]);

  return { ...state, login, register, logout };
}
