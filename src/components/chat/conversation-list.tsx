"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Conversation = {
  id: string
  sessionId: string
  email: string
  status: string
  createdAt: Date
  updatedAt: Date
  messages: {
    id: string
    content: string
    senderType: string
    createdAt: Date
  }[]
  _count: {
    messages: number
  }
}

export function ConversationList({
  conversations,
}: {
  conversations: Conversation[]
}) {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Link key={conversation.id} href={`/dashboard/inbox/${conversation.id}`} className="block">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{conversation.email}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {conversation.messages[0]?.content || "No messages"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                      {conversation.status}
                    </Badge>
                    <Badge variant="outline">
                      {conversation._count.messages} {conversation._count.messages === 1 ? "message" : "messages"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
