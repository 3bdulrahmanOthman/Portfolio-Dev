import { z } from "zod"

export const emailSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
})

export const messageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }).max(1000, { message: "Message is too long" }),
})

export type EmailFormValues = z.infer<typeof emailSchema>
export type MessageFormValues = z.infer<typeof messageSchema>
