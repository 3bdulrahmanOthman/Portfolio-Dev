"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, Send, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { sendMessage, verifyEmail } from "@/actions/chat"
import { cn } from "@/lib/utils"
import { emailSchema, messageSchema, type EmailFormValues, type MessageFormValues } from "@/lib/validations/chat"

type Message = {
  id: string
  content: string
  senderType: "visitor" | "admin"
  createdAt: Date
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string>("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Email verification form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  // Message form
  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    // Generate or retrieve session ID from localStorage
    const storedSessionId = localStorage.getItem("chat-session-id")
    if (storedSessionId) {
      setSessionId(storedSessionId)

      // Check if email is already verified for this session
      const storedEmail = localStorage.getItem("chat-email")
      const storedVerified = localStorage.getItem("chat-verified")

      if (storedEmail && storedVerified === "true") {
        setEmail(storedEmail)
        setIsVerified(true)
      }
    } else {
      // Use crypto.randomUUID() instead of uuid library
      const newSessionId = crypto.randomUUID()
      localStorage.setItem("chat-session-id", newSessionId)
      setSessionId(newSessionId)
    }
  }, [])

  useEffect(() => {
    if (sessionId && isVerified) {
      // Load previous messages
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/chat/${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            setMessages(data.messages)
          }
        } catch (error) {
          console.error("Error fetching messages:", error)
        }
      }

      fetchMessages()

      // Set up polling for new messages
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [sessionId, isVerified])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleEmailSubmit = async (data: EmailFormValues) => {
    if (!sessionId) return

    setIsLoading(true)

    try {
      const result = await verifyEmail({
        email: data.email,
        sessionId,
      })

      if (result.success) {
        setEmail(data.email)
        setIsVerified(true)
        localStorage.setItem("chat-email", data.email)
        localStorage.setItem("chat-verified", "true")
      } else if (result.error) {
        emailForm.setError("email", {
          type: "manual",
          message: result.error,
        })
      }
    } catch (error) {
      console.error("Error verifying email:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (data: MessageFormValues) => {
    if (!sessionId || !isVerified) return

    setIsLoading(true)

    try {
      // Optimistically update UI
      const tempId = crypto.randomUUID()
      const newMessage = {
        id: tempId,
        content: data.content,
        senderType: "visitor" as const,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      messageForm.reset()

      // Send to server
      await sendMessage({
        content: data.content,
        sessionId,
        senderType: "visitor",
      })
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border"
          >
            <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
              <h3 className="font-medium">Chat with Me</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!isVerified ? (
              <div className="flex-1 p-4 flex flex-col justify-center">
                <div className="text-center mb-4">
                  <h4 className="font-medium text-lg">Enter your email to start chatting</h4>
                  <p className="text-muted-foreground text-sm">
                    Your email will only be used to identify your conversation
                  </p>
                </div>

                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Start Chatting"}
                    </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Send a message to start the conversation
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          msg.senderType === "visitor"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted mr-auto",
                        )}
                      >
                        <div className="text-xs opacity-70 mb-1">
                          {msg.senderType === "visitor" ? "You" : "Admin"}
                          {" • "}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        {msg.content}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <Form {...messageForm}>
                  <form onSubmit={messageForm.handleSubmit(handleSendMessage)} className="p-4 border-t">
                    <div className="flex gap-2">
                      <FormField
                        control={messageForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder="Type your message..."
                                className="min-h-10 resize-none"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    messageForm.handleSubmit(handleSendMessage)()
                                  }
                                }}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="icon" disabled={isLoading || !messageForm.formState.isValid}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
