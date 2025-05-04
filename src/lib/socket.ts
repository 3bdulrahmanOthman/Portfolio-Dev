import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log("Socket is already running")
    res.end()
    return
  }

  const io = new SocketIOServer(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
  })

  res.socket.server.io = io

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error"))
    }

    try {
      const decoded = await getToken({
        req: { cookies: { "next-auth.session-token": token } } as any,
        secret: process.env.NEXTAUTH_SECRET,
      })

      if (!decoded) {
        return next(new Error("Authentication error"))
      }

      socket.data.user = decoded
      next()
    } catch {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId)
      console.log(`Socket ${socket.id} joined conversation: ${conversationId}`)
    })

    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId)
      console.log(`Socket ${socket.id} left conversation: ${conversationId}`)
    })

    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit("user-typing", {
        userId: socket.data.user.id,
        isTyping,
      })
    })

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })

  console.log("Socket server initialized")
  res.end()
}
