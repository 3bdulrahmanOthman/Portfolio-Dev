"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { rateLimit } from "../lib/rate-limit";

const LOGIN_ATTEMPTS_LIMIT = 5;
const LOGIN_ATTEMPTS_WINDOW = 60 * 15; // seconds

function getClientIp(headerList: Awaited<ReturnType<typeof headers>>) {
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown"
  );
}

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  // Fail closed: a limiter error (including a Redis outage) blocks the
  // attempt instead of letting it through. The message is generic and
  // carries no account information.
  try {
    const headerList = await headers();

    await rateLimit({
      id: `login_${getClientIp(headerList)}`,
      limit: LOGIN_ATTEMPTS_LIMIT,
      timeframe: LOGIN_ATTEMPTS_WINDOW,
      context: "login",
    });
  } catch {
    return { error: "Too many attempts. Please try again later." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    // One identical response for unknown email and wrong password: the
    // response must not reveal whether an account exists.
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }

    throw error;
  }
};
