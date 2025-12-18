import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveUser } from "@/lib/user-resolver"
import { z } from "zod"

const bodySchema = z.object({
  userId: z.string().min(1),
  reason: z.string().max(500).optional(),
})

export async function GET() {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const blocks = await prisma.block.findMany({
      where: { blockerId: user.id },
      select: { blockedUserId: true, reason: true, createdAt: true },
    })
    return NextResponse.json({ results: blocks })
  } catch (error) {
    console.error("GET /api/block error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    if (parsed.data.userId === user.id) {
      return NextResponse.json({ error: "Cannot block yourself" }, { status: 400 })
    }

    await prisma.block.upsert({
      where: {
        blockerId_blockedUserId: {
          blockerId: user.id,
          blockedUserId: parsed.data.userId,
        },
      },
      update: { reason: parsed.data.reason },
      create: {
        blockerId: user.id,
        blockedUserId: parsed.data.userId,
        reason: parsed.data.reason,
      },
    })

    return NextResponse.json({ message: "User blocked" }, { status: 201 })
  } catch (error) {
    console.error("POST /api/block error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    await prisma.block.deleteMany({
      where: {
        blockerId: user.id,
        blockedUserId: parsed.data.userId,
      },
    })

    return NextResponse.json({ message: "User unblocked" })
  } catch (error) {
    console.error("DELETE /api/block error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
