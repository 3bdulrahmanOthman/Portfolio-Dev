"use server";

import * as z from "zod";

import { unstable_update } from "@/auth";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "../lib/user";
import { prisma } from "../lib/db/prisma";
import { Prisma } from "../../generated/prisma/client";
import { compare, hash } from "bcrypt-ts";
import { currentUser } from "@/data/user";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "User Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "DB Unauthorized" };
  }

  // The schema's password-pairing and confirmation refines only run here:
  // the form validates client-side, but this boundary previously never
  // parsed, so newPasswordConfirmation could reach Prisma unvalidated.
  const parsed = SettingsSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password, newPassword } = parsed.data;

  let hashedNewPassword: string | undefined;

  if (password && newPassword && dbUser.password) {
    const passwordsMatch = await compare(password, dbUser.password);

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    hashedNewPassword = await hash(newPassword, 12);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(hashedNewPassword !== undefined && {
          password: hashedNewPassword,
        }),
      },
    });

    unstable_update({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "Email is already in use" };
    }

    console.error("Failed to update settings:", error);
    return { error: "Failed to update settings" };
  }

  return { success: "Settings Updated!" };
};
