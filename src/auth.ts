import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  ...authConfig,
});
