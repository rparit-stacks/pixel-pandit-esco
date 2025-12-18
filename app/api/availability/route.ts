import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveEscortWithProfile } from "@/lib/user-resolver"
import { z } from "zod"

const schema = z.object({
  isOnline: z.boolean().optional(),
  callsEnabled: z.boolean().optional(),
})

export async function PATCH(request: Request) {
  try {
    const result = await resolveEscortWithProfile()
    
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json({ 
        error: result?.error || "Unauthorized" 
      }, { status: result?.error === "Not an escort" ? 403 : 401 })
    }

    const { profile } = result

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...(parsed.data.isOnline !== undefined && { isOnline: parsed.data.isOnline }),
        ...(parsed.data.callsEnabled !== undefined && { callsEnabled: parsed.data.callsEnabled }),
      },
      select: {
        id: true,
        isOnline: true,
        callsEnabled: true,
      },
    })

    console.log(`Availability updated for profile ${profile.id}: online=${updated.isOnline}, calls=${updated.callsEnabled}`)
    return NextResponse.json({ profile: updated })
  } catch (error) {
    console.error("PATCH /api/availability error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await resolveEscortWithProfile()
    
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json({ 
        error: result?.error || "Unauthorized" 
      }, { status: result?.error === "Not an escort" ? 403 : 401 })
    }

    const { profile } = result

    return NextResponse.json({ 
      profile: {
        id: profile.id,
        isOnline: profile.isOnline,
        callsEnabled: profile.callsEnabled,
      }
    })
  } catch (error) {
    console.error("GET /api/availability error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
