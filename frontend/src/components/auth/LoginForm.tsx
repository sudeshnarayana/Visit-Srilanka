"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "./PasswordInput";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validations/auth";

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const result = loginSchema.safeParse({ email, password, rememberMe });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      // TODO Phase 9: surface real Supabase auth errors here (invalid
      // credentials, unconfirmed email, etc.) instead of always succeeding.
      await login(result.data);
      router.push("/profile");
    } catch {
      setFormError("Something went wrong signing you in. Please try again.");
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="pl-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="#" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
        <span className="text-sm text-muted-foreground">Remember me</span>
      </label>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" size="lg" disabled={isLoading} className="gap-2">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <SocialLoginButtons />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </motion.form>
  );
}
