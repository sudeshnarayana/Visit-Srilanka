import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Visit Sri Lanka account to save destinations, hotels, and trip itineraries.",
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Save favorites and plan trips across visits.">
      <RegisterForm />
    </AuthLayout>
  );
}
