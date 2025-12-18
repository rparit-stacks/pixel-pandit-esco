import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth-server"
import { Role, CallRequestStatus } from "@prisma/client"
import { z } from "zod"

// Helper to resolve user from database
async function resolveUser(session: any) {
  let dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true, name: true }
  })

  if (!dbUser && session.user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true, name: true }
    })
  }

  return dbUser
}

const createSchema = z.object({
  escortProfileId: z.string().min(1),
  scheduledAt: z.string().optional(),
  notes: z.string().optional(),
})

const updateSchema = z.object({
  callId: z.string().min(1),
  action: z.enum(["accept", "reject", "complete", "cancel"]),
})

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await resolveUser(session)
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    if (dbUser.role === Role.CLIENT) {
      const items = await prisma.callRequest.findMany({
        where: { clientId: dbUser.id },
        include: { 
          escortProfile: { 
            select: { id: true, displayName: true, mainPhotoUrl: true } 
          } 
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ results: items })
    }

    if (dbUser.role === Role.ESCORT) {
      const profile = await prisma.profile.findUnique({ 
        where: { userId: dbUser.id }, 
        select: { id: true } 
      })
      
      if (!profile) {
        return NextResponse.json({ 
          pending: [], 
          accepted: [], 
          history: [] 
        })
      }

      const allCalls = await prisma.callRequest.findMany({
        where: { escortProfileId: profile.id },
        include: { 
          client: { 
            select: { id: true, email: true, name: true } 
          } 
        },
        orderBy: { createdAt: "desc" },
      })

      // Format calls for the frontend
      const formatCall = (call: any) => ({
        id: call.id,
        clientId: call.clientId,
        clientEmail: call.client?.email || "Unknown",
        clientName: call.client?.name || null,
        status: call.status,
        scheduledAt: call.scheduledAt,
        notes: call.notes,
        createdAt: call.createdAt,
        updatedAt: call.updatedAt
      })

      const pending = allCalls.filter(c => c.status === CallRequestStatus.PENDING).map(formatCall)
      const accepted = allCalls.filter(c => c.status === CallRequestStatus.ACCEPTED).map(formatCall)
      const history = allCalls.filter(c => 
        c.status === CallRequestStatus.REJECTED || 
        c.status === CallRequestStatus.COMPLETED ||
        c.status === CallRequestStatus.CANCELLED
      ).map(formatCall)

      return NextResponse.json({ pending, accepted, history })
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    console.error("GET /api/call-requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await resolveUser(session)
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (dbUser.role !== Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden - Clients only" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const escortProfile = await prisma.profile.findUnique({
      where: { id: parsed.data.escortProfileId },
      select: { id: true, callsEnabled: true },
    })

    if (!escortProfile) {
      return NextResponse.json({ error: "Escort not found" }, { status: 404 })
    }

    if (!escortProfile.callsEnabled) {
      return NextResponse.json({ error: "Calls are disabled by this escort" }, { status: 400 })
    }

    const requestRow = await prisma.callRequest.create({
      data: {
        clientId: dbUser.id,
        escortProfileId: parsed.data.escortProfileId,
        scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
        notes: parsed.data.notes || null,
      },
    })

    return NextResponse.json({ message: "Call request sent", request: requestRow }, { status: 201 })
  } catch (error) {
    console.error("POST /api/call-requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await resolveUser(session)
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const call = await prisma.callRequest.findUnique({
      where: { id: parsed.data.callId },
      include: { 
        escortProfile: { select: { id: true, userId: true } }, 
        client: { select: { id: true } } 
      },
    })

    if (!call) {
      return NextResponse.json({ error: "Call request not found" }, { status: 404 })
    }

    // Map action to status
    const actionToStatus: Record<string, CallRequestStatus> = {
      accept: CallRequestStatus.ACCEPTED,
      reject: CallRequestStatus.REJECTED,
      complete: CallRequestStatus.COMPLETED,
      cancel: CallRequestStatus.CANCELLED,
    }

    const newStatus = actionToStatus[parsed.data.action]

    // Permission checks
    if (parsed.data.action === "cancel") {
      // Only client can cancel
      if (call.clientId !== dbUser.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    } else {
      // Only escort can accept/reject/complete
      if (call.escortProfile.userId !== dbUser.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const updated = await prisma.callRequest.update({
      where: { id: parsed.data.callId },
      data: { status: newStatus },
    })

    return NextResponse.json({ message: "Updated", request: updated })
  } catch (error) {
    console.error("PATCH /api/call-requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
