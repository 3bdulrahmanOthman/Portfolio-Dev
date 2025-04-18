"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createSafeAction, type ActionState } from "@/lib/utils"
import { AboutSchema } from "@/schemas"
import { prisma } from "../db/prisma"
import { About } from '../validations/index';


type AboutOutput = ActionState<About, { success: boolean }>

export async function getAbout() {
  try {
    const about = await prisma.about.findFirst()
    return about
  } catch (error) {
    console.error("Failed to fetch about:", error)
    throw new Error("Failed to fetch about data")
  }
}

async function handler(data: About): Promise<AboutOutput> {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const { id, ...values } = data

    if (id) {
      await prisma.about.update({
        where: { id },
        data: values,
      })
    } else {
      const existingAbout = await prisma.about.findFirst()

      if (existingAbout) {
        await prisma.about.update({
          where: { id: existingAbout.id },
          data: values,
        })
      } else {
        await prisma.about.create({
          data: values,
        })
      }
    }

    revalidatePath("/about")
    revalidatePath("/admin/about")

    return {
      data: { success: true },
    }
  } catch (error) {
    console.error("Failed to save about:", error)
    return {
      error: "Failed to save about data",
    }
  }
}

export const upsertAbout = createSafeAction(AboutSchema, handler)
