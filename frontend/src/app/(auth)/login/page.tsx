import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Visit Sri Lanka account to access saved trips, favorites, and travel history.",
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue planning your Sri Lanka trip.">
      <LoginForm />
    </AuthLayout>
  );
}
