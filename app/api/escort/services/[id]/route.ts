import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveEscortWithProfile } from "@/lib/user-resolver"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().min(1).optional(), // HTML/JSON
  price: z.number().nonnegative().optional(),
  duration: z.string().max(100).optional().nullable(), // Flexible: "2 hours", "1 night", "3 shots", etc.
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  locationRadius: z.number().positive().optional().nullable(),
  locationAddress: z.string().max(500).optional().nullable(),
  conditions: z.string().max(500).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  try {
    const result = await resolveEscortWithProfile()
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json(
        { error: result?.error || "Unauthorized" },
        { status: result?.error === "Not an escort" ? 403 : 401 }
      )
    }

    const service = await prisma.service.findFirst({
      where: { id: params.id, profileId: result.profile.id },
    })

    if (!service) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error("GET /api/escort/services/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const result = await resolveEscortWithProfile()
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json(
        { error: result?.error || "Unauthorized" },
        { status: result?.error === "Not an escort" ? 403 : 401 }
      )
    }

    const json = await request.json()
    const parsed = updateSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 })
    }

    // ensure service belongs to this profile
    const existing = await prisma.service.findFirst({
      where: { id: params.id, profileId: result.profile.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const data = parsed.data
    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.locationLat !== undefined && { locationLat: data.locationLat }),
        ...(data.locationLng !== undefined && { locationLng: data.locationLng }),
        ...(data.locationRadius !== undefined && { locationRadius: data.locationRadius }),
        ...(data.locationAddress !== undefined && { locationAddress: data.locationAddress }),
        ...(data.conditions !== undefined && { conditions: data.conditions }),
        ...(data.status !== undefined && { status: data.status }),
      },
    })

    return NextResponse.json({ service: updated })
  } catch (error) {
    console.error("PATCH /api/escort/services/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const result = await resolveEscortWithProfile()
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json(
        { error: result?.error || "Unauthorized" },
        { status: result?.error === "Not an escort" ? 403 : 401 }
      )
    }

    // ensure service belongs to this profile
    const existing = await prisma.service.findFirst({
      where: { id: params.id, profileId: result.profile.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.service.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/escort/services/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


