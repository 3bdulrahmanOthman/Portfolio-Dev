"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createSafeAction, type ActionState } from "@/lib/utils"
import { ContactSchema } from "@/schemas"
import { prisma } from "../db/prisma"
import { Contact } from '../validations/index';


type ContactOutput = ActionState<Contact, { success: boolean }>

export async function getContact() {
  try {
    const contact = await prisma.contact.findFirst()
    return contact
  } catch (error) {
    console.error("Failed to fetch contact:", error)
    throw new Error("Failed to fetch contact data")
  }
}

async function handler(data: Contact): Promise<ContactOutput> {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const { id, ...values } = data

    if (id) {
      await prisma.contact.update({
        where: { id },
        data: values,
      })
    } else {
      const existingContact = await prisma.contact.findFirst()

      if (existingContact) {
        await prisma.contact.update({
          where: { id: existingContact.id },
          data: values,
        })
      } else {
        await prisma.contact.create({
          data: values,
        })
      }
    }

    revalidatePath("/contact")
    revalidatePath("/admin/contact")

    return {
      data: { success: true },
    }
  } catch (error) {
    console.error("Failed to save contact:", error)
    return {
      error: "Failed to save contact data",
    }
  }
}

export const upsertContact = createSafeAction(ContactSchema, handler)
