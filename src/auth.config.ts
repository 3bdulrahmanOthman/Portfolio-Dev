import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { compare } from "bcrypt-ts";
import { getUserByEmail } from "./lib/user";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        // Bcrypt hash of a discarded random string (not a credential). It
        // equalizes the cost of the "unknown email" path with the
        // "wrong password" path so response timing cannot be used to
        // enumerate registered accounts.
        const DUMMY_HASH =
          "$2b$12$8QrKo9o7pd5dDisTk7Zh/.KtZ4l1Oxi95S5nEySOLwr2yrue8vxhC";

        const user = await getUserByEmail(email);

        if (!user || !user.email || !user.password) {
          await compare(password, DUMMY_HASH);
          return null;
        }

        const isPasswordValid = await compare(password, user.password);

        return isPasswordValid ? user : null;
      },
    }),
  ],
} satisfies NextAuthConfig;
