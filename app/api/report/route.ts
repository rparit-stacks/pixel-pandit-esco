import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveUser } from "@/lib/user-resolver"
import { z } from "zod"

const schema = z.object({
  reportedUserId: z.string().min(1),
  reason: z.string().min(3).max(200),
  details: z.string().max(2000).optional(),
})

export async function POST(request: Request) {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const json = await request.json()
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    if (parsed.data.reportedUserId === user.id) {
      return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        reportedUserId: parsed.data.reportedUserId,
        reason: parsed.data.reason,
        details: parsed.data.details,
      },
    })

    return NextResponse.json({ message: "Report submitted", report }, { status: 201 })
  } catch (error) {
    console.error("POST /api/report error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
