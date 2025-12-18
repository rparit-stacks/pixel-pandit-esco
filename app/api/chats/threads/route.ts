import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveUser, resolveOrCreateUser, resolveEscortWithProfile } from "@/lib/user-resolver"
import { Role, ChatRequestStatus } from "@prisma/client"

export async function GET() {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role === Role.CLIENT) {
      const threads = await prisma.chatThread.findMany({
        where: { clientId: user.id },
        include: {
          escortProfile: { 
            select: { 
              id: true, 
              displayName: true, 
              mainPhotoUrl: true,
              isOnline: true
            } 
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { body: true, createdAt: true, senderId: true }
          }
        },
        orderBy: { updatedAt: "desc" },
      })
      return NextResponse.json({ results: threads })
    }

    if (user.role === Role.ESCORT) {
      const profile = await prisma.profile.findUnique({ 
        where: { userId: user.id }, 
        select: { id: true } 
      })
      if (!profile) {
        return NextResponse.json({ results: [] })
      }
      
      const threads = await prisma.chatThread.findMany({
        where: { escortProfileId: profile.id },
        include: {
          client: { 
            select: { 
              id: true, 
              email: true,
              name: true
            } 
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { body: true, createdAt: true, senderId: true }
          }
        },
        orderBy: { updatedAt: "desc" },
      })
      return NextResponse.json({ results: threads })
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    console.error("GET /api/chats/threads error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Use resolveOrCreateUser to ensure client exists
    const user = await resolveOrCreateUser(Role.CLIENT)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (user.role !== Role.CLIENT) {
      return NextResponse.json({ error: "Only clients can start chats" }, { status: 403 })
    }

    const body = await request.json()
    const { escortProfileId } = body
    
    if (!escortProfileId) {
      return NextResponse.json({ error: "escortProfileId is required" }, { status: 400 })
    }

    // Verify escort profile exists
    const escortProfile = await prisma.profile.findUnique({
      where: { id: escortProfileId },
      select: { id: true, displayName: true },
    })
    
    if (!escortProfile) {
      return NextResponse.json({ error: "Escort not found" }, { status: 404 })
    }

    console.log(`Creating thread: client=${user.id} (${user.email}), escort=${escortProfileId}`)

    // Check if thread already exists
    const existingThread = await prisma.chatThread.findUnique({
      where: {
        clientId_escortProfileId: {
          clientId: user.id,
          escortProfileId: escortProfileId,
        },
      },
    })

    if (existingThread) {
      console.log("Thread exists:", existingThread.id)
      const updated = await prisma.chatThread.update({
        where: { id: existingThread.id },
        data: { updatedAt: new Date() },
      })
      return NextResponse.json({ thread: updated }, { status: 200 })
    }

    // Create new thread
    const thread = await prisma.chatThread.create({
      data: {
        clientId: user.id,
        escortProfileId: escortProfileId,
        status: ChatRequestStatus.PENDING,
      },
    })

    console.log("Thread created:", thread.id)
    return NextResponse.json({ thread }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/chats/threads error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, profile, error } = await resolveEscortWithProfile() || {}
    
    if (error || !user || !profile) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { threadId, status } = body
    
    if (!threadId || !["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    // Verify thread belongs to this escort
    const thread = await prisma.chatThread.findFirst({
      where: { 
        id: threadId,
        escortProfileId: profile.id
      }
    })
    
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    const updatedThread = await prisma.chatThread.update({
      where: { id: threadId },
      data: { 
        status: status as ChatRequestStatus,
        updatedAt: new Date()
      }
    })

    console.log(`Thread ${threadId} status updated to ${status}`)
    return NextResponse.json({ thread: updatedThread })
  } catch (error) {
    console.error("PATCH /api/chats/threads error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const threadId = searchParams.get("threadId")
    
    if (!threadId) {
      return NextResponse.json({ error: "Thread ID required" }, { status: 400 })
    }

    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: { escortProfile: { select: { userId: true } } }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Check ownership
    const isClient = thread.clientId === user.id
    const isEscort = thread.escortProfile.userId === user.id

    if (!isClient && !isEscort) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.chatThread.delete({
      where: { id: threadId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/chats/threads error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
