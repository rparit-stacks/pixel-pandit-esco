import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveUser } from "@/lib/user-resolver"
import { MessageStatus } from "@prisma/client"
import { z } from "zod"

const statusUpdateSchema = z.object({
  status: z.enum(["sent", "delivered", "seen"]),
})

type Params = { params: Promise<{ id: string }> }

// Update message status (for read receipts, delivery confirmations)
export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = statusUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    // Get message and verify user has access
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      include: {
        thread: {
          select: {
            clientId: true,
            escortProfile: { select: { userId: true } },
          },
        },
      },
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Only recipient can update status (not the sender)
    const isClient = message.thread.clientId === user.id
    const isEscort = message.thread.escortProfile.userId === user.id
    const isSender = message.senderId === user.id

    if (!isClient && !isEscort) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Recipients can mark as delivered/seen, but not update their own sent messages
    if (isSender && parsed.data.status !== "sent") {
      return NextResponse.json({ error: "Cannot update status of own message" }, { status: 403 })
    }

    const updated = await prisma.chatMessage.update({
      where: { id },
      data: {
        status: parsed.data.status as MessageStatus,
      },
      select: {
        id: true,
        status: true,
      },
    })

    return NextResponse.json({ message: updated })
  } catch (error) {
    console.error("PATCH /api/chats/messages/[id]/status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

