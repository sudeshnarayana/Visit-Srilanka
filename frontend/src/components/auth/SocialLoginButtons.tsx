"use client";

import { Button } from "@/components/ui/button";
import type { SocialProvider } from "@/types/user";

interface SocialLoginButtonsProps {
  onSelect?: (provider: SocialProvider) => void;
}

/**
 * Placeholder social auth entry points. Not wired to a real provider yet —
 * add a Google/Facebook OAuth provider to src/auth.ts and replace
 * `onSelect` with `signIn("google")` / `signIn("facebook")` from
 * next-auth/react once configured.
 */
export function SocialLoginButtons({ onSelect }: SocialLoginButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Or continue with
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => onSelect?.("google")}
        >
          <GoogleIcon />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => onSelect?.("facebook")}
        >
          <FacebookIcon />
          Facebook
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Social login connects once a Google/Facebook provider is configured in src/auth.ts.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.35-1.68 3.96-5.5 3.96-3.31 0-6.02-2.74-6.02-6.12S8.69 5.82 12 5.82c1.89 0 3.16.8 3.88 1.5l2.65-2.55C16.9 3.15 14.66 2.1 12 2.1 6.98 2.1 2.9 6.18 2.9 11.2S6.98 20.3 12 20.3c6.93 0 8.36-6.02 7.72-9.06H12z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.53c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.99v2.96h2.47V21h3.04z"
      />
    </svg>
  );
}
