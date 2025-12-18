import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveUser } from "@/lib/user-resolver"
import { ChatRequestStatus, MessageType, MessageStatus } from "@prisma/client"
import { z } from "zod"

const sendSchema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1).max(2000).optional(), // Legacy support
  type: z.enum(["TEXT", "MEDIA", "LOCATION", "VOICE", "OFFER", "TODO"]).optional(),
  payload: z.any().optional(),
})

export async function GET(request: Request) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const threadId = url.searchParams.get("threadId")
    if (!threadId) {
      return NextResponse.json({ error: "threadId is required" }, { status: 400 })
    }

    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      select: { 
        clientId: true, 
        status: true,
        escortProfile: { select: { userId: true } } 
      },
    })
    
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Check if user can access this thread
    const isClient = thread.clientId === user.id
    const isEscort = thread.escortProfile.userId === user.id

    if (!isClient && !isEscort) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const rawMessages = await prisma.chatMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      select: { 
        id: true, 
        senderId: true, 
        body: true, 
        type: true,
        payload: true,
        status: true,
        createdAt: true 
      },
    })

    const messages = rawMessages.map((m) => ({
      ...m,
      isMine: m.senderId === user.id,
    }))

    return NextResponse.json({ messages, status: thread.status })
  } catch (error) {
    console.error("GET /api/chats/messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = sendSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const thread = await prisma.chatThread.findUnique({
      where: { id: parsed.data.threadId },
      include: { escortProfile: { select: { userId: true } } },
    })
    
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Check if thread is accepted
    if (thread.status !== ChatRequestStatus.ACCEPTED) {
      return NextResponse.json({ 
        error: "Chat request must be accepted before sending messages" 
      }, { status: 403 })
    }

    // Check if user can send to this thread
    const isClient = thread.clientId === user.id
    const isEscort = thread.escortProfile.userId === user.id

    if (!isClient && !isEscort) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Determine message type and payload
    let msgType: MessageType = MessageType.TEXT
    let payload: any = null
    let bodyText: string = ""

    // Support new format (type + payload) or legacy format (body string with prefixes)
    if (parsed.data.type && parsed.data.payload !== undefined) {
      // New format: explicit type and payload
      msgType = parsed.data.type as MessageType
      payload = parsed.data.payload
      // Generate body from payload for backward compatibility
      if (msgType === MessageType.TEXT) {
        bodyText = typeof payload === "string" ? payload : parsed.data.body || ""
      } else {
        bodyText = `${msgType}::${JSON.stringify(payload)}`
      }
    } else if (parsed.data.body) {
      // Legacy format: parse from body string
      const rawBody: string = parsed.data.body
      if (rawBody.startsWith("MEDIA::")) {
        msgType = MessageType.MEDIA
        try {
          payload = JSON.parse(rawBody.slice(7))
        } catch {
          payload = null
        }
        bodyText = rawBody
      } else if (rawBody.startsWith("LOCATION::")) {
        msgType = MessageType.LOCATION
        try {
          payload = JSON.parse(rawBody.slice(10))
        } catch {
          payload = null
        }
        bodyText = rawBody
      } else if (rawBody.startsWith("VOICE::")) {
        msgType = MessageType.VOICE
        try {
          payload = JSON.parse(rawBody.slice(7))
        } catch {
          payload = null
        }
        bodyText = rawBody
      } else if (rawBody.startsWith("OFFER::")) {
        msgType = MessageType.OFFER
        try {
          payload = JSON.parse(rawBody.slice(7))
        } catch {
          payload = null
        }
        bodyText = rawBody
      } else if (rawBody.startsWith("OFFER_RESPONSE::")) {
        msgType = MessageType.OFFER
        try {
          const parsedPayload = JSON.parse(rawBody.slice(16))
          payload = { ...parsedPayload, response: "ACCEPTED" }
        } catch {
          payload = { response: "ACCEPTED" }
        }
        bodyText = `Offer accepted`
      } else if (rawBody.startsWith("TODO::")) {
        msgType = MessageType.TODO
        try {
          payload = JSON.parse(rawBody.slice(6))
        } catch {
          payload = null
        }
        bodyText = rawBody
      } else {
        // Plain text
        msgType = MessageType.TEXT
        bodyText = rawBody
        payload = rawBody
      }
    } else {
      return NextResponse.json({ error: "Either body or type+payload required" }, { status: 400 })
    }

    const message = await prisma.chatMessage.create({
      data: {
        threadId: parsed.data.threadId,
        senderId: user.id,
        body: bodyText,
        type: msgType,
        payload: payload,
        status: MessageStatus.sent,
      },
      select: { 
        id: true, 
        senderId: true, 
        body: true, 
        type: true,
        payload: true,
        status: true,
        createdAt: true 
      },
    })

    // Update thread timestamp
    await prisma.chatThread.update({
      where: { id: parsed.data.threadId },
      data: { updatedAt: new Date() },
    })

    console.log(`Message sent in thread ${parsed.data.threadId} by ${user.email}`)
    return NextResponse.json({ message: { ...message, isMine: true } }, { status: 201 })
  } catch (error) {
    console.error("POST /api/chats/messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
