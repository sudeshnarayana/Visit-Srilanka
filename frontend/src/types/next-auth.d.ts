import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      country?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    country?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    country?: string;
    role?: string;
  }
}
