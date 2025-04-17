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

        const user = await getUserByEmail(email);

        if (!user || !user.email || !user.password) return null;

        const isPasswordValid = await compare(password, user.password);

        return isPasswordValid ? user : null;
      },
    }),
  ],
} satisfies NextAuthConfig;
