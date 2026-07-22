import type { NextAuthConfig } from "next-auth";

const publicRoutes = ["/", "/login", "/register", "/about", "/contact"];
const publicPrefixes = ["/api/auth", "/api/register", "/api/test-db"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && auth?.user?.role === "ADMIN";
      }

      if (publicRoutes.includes(pathname)) {
        return true;
      }

      if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
        return true;
      }

      return isLoggedIn;
    },
    // 👇 අලුතින් add කරන කොටස — token එකේ role එක session.user.role එකට copy කරනවා
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;