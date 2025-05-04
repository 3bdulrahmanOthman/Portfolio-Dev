"use server"

import { revalidatePath } from "next/cache"
import { rateLimit } from "@/lib/rate-limit"
import { emailSchema, messageSchema } from "@/lib/validations/chat"
import { prisma } from "@/lib/db/prisma"

export async function verifyEmail({
  email,
  sessionId,
}: {
  email: string
  sessionId: string
}) {
  try {
    // Validate email
    const validatedFields = emailSchema.safeParse({ email })

    if (!validatedFields.success) {
      return { error: "Invalid email address" }
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { sessionId },
    })

    if (conversation) {
      // Update existing conversation with email
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          email,
          verified: true,
        },
      })
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          sessionId,
          email,
          verified: true,
        },
      })
    }

    return { success: true, conversation }
  } catch (error) {
    console.error("Error verifying email:", error)
    return { error: "Failed to verify email" }
  }
}

export async function sendMessage({
  content,
  sessionId,
  senderType,
}: {
  content: string
  sessionId: string
  senderType: "visitor" | "admin"
}) {
  try {
    // Validate message content
    const validatedFields = messageSchema.safeParse({ content })

    if (!validatedFields.success) {
      return { error: "Invalid message content" }
    }

    // Apply rate limiting for visitors
    if (senderType === "visitor") {
      try {
        await rateLimit({
          id: sessionId,
          limit: 5,
          timeframe: 30,
          context: "chat",
        })
      } catch (error) {
        return { error: (error as Error).message }
      }
    }

    // Find conversation
    const conversation = await prisma.conversation.findUnique({
      where: { sessionId },
    })

    if (!conversation) {
      return { error: "Conversation not found" }
    }

    // Verify that visitor has verified email
    if (senderType === "visitor" && !conversation.verified) {
      return { error: "Email not verified" }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderType,
        conversationId: conversation.id,
      },
    })

    revalidatePath(`/api/chat/${sessionId}`)
    revalidatePath("/dashboard/inbox")

    return { success: true, message }
  } catch (error) {
    console.error("Error sending message:", error)
    return { error: "Failed to send message" }
  }
}

export async function getConversations() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
    })

    return { conversations }
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return { error: "Failed to fetch conversations" }
  }
}

export async function getConversation(id: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!conversation) {
      return { error: "Conversation not found" }
    }

    return { conversation }
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return { error: "Failed to fetch conversation" }
  }
}

export async function archiveConversation(id: string) {
  try {
    await prisma.conversation.update({
      where: { id },
      data: { status: "archived" },
    })

    revalidatePath("/dashboard/inbox")

    return { success: true }
  } catch (error) {
    console.error("Error archiving conversation:", error)
    return { error: "Failed to archive conversation" }
  }
}
