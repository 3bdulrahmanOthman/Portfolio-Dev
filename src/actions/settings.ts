"use server";

import * as z from "zod";

import { unstable_update } from "@/auth";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "../lib/user";
import { prisma } from "../lib/db/prisma";
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

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await hash(values.newPassword, 12);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });

  return { success: "Settings Updated!" };
};