"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Archive, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { sendMessage, archiveConversation } from "@/actions/chat"
import { cn } from "@/lib/utils"
import { MessageFormValues, messageSchema } from "@/lib/validations/chat"

type Message = {
  id: string
  content: string
  senderType: string
  createdAt: Date
}

type Conversation = {
  id: string
  sessionId: string
  email: string
  status: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export function ConversationView({
  conversation,
}: {
  conversation: Conversation
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  const handleSendMessage = async (data: MessageFormValues) => {
    setIsLoading(true)

    try {
      await sendMessage({
        content: data.content,
        sessionId: conversation.sessionId,
        senderType: "admin",
      })

      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async () => {
    try {
      await archiveConversation(conversation.id)
      router.refresh()
    } catch (error) {
      console.error("Error archiving conversation:", error)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/inbox")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{conversation.email}</h1>
            <p className="text-sm text-muted-foreground">Session ID: {conversation.sessionId.substring(0, 8)}...</p>
          </div>
          <Badge variant={conversation.status === "active" ? "default" : "secondary"}>{conversation.status}</Badge>
        </div>

        {conversation.status === "active" && (
          <Button variant="outline" size="sm" onClick={handleArchive} className="gap-1">
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="py-3 px-4 border-b">
          <div className="text-sm text-muted-foreground">
            Started {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                msg.senderType === "admin" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted mr-auto",
              )}
            >
              <div className="mb-1 text-xs opacity-70">
                {msg.senderType === "admin" ? "You" : conversation.email} •{" "}
                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
              </div>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-4 border-t">
          {conversation.status === "active" ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendMessage)} className="w-full">
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            placeholder="Type your reply..."
                            className="min-h-10 resize-none"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                form.handleSubmit(handleSendMessage)()
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !form.formState.isValid}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="w-full text-center text-muted-foreground py-2">This conversation has been archived</div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
