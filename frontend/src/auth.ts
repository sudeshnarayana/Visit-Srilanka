import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";

import clientPromise from "@/lib/mongodb";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * - MongoDBAdapter is wired up for future OAuth providers (Google/Facebook
 *   — see components/auth/SocialLoginButtons.tsx, still placeholders) even
 *   though the Credentials provider below doesn't use it directly.
 * - Session strategy must be "jwt" — Auth.js doesn't support database
 *   sessions with the Credentials provider by design (no server-side
 *   session record is created on a plain email/password sign-in).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db();
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email as string });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash as string
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name as string,
          email: user.email as string,
          country: user.country as string | undefined,
          role: (user.role as string) ?? "TOURIST",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.country = (user as { country?: string }).country;
        token.role = (user as { role?: string }).role ?? "TOURIST";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.country = token.country as string | undefined;
        session.user.role = (token.role as string) ?? "TOURIST";
      }
      return session;
    },
  },
});
