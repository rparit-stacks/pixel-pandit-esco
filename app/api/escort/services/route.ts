import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveEscortWithProfile } from "@/lib/user-resolver"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1), // store as HTML/JSON
  price: z.number().nonnegative(),
  duration: z.string().max(100).optional().nullable(), // Flexible: "2 hours", "1 night", "3 shots", etc.
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  locationRadius: z.number().positive().optional().nullable(),
  locationAddress: z.string().max(500).optional().nullable(),
  conditions: z.string().max(500).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export async function GET() {
  try {
    const result = await resolveEscortWithProfile()
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json(
        { error: result?.error || "Unauthorized" },
        { status: result?.error === "Not an escort" ? 403 : 401 }
      )
    }

    const services = await prisma.service.findMany({
      where: { profileId: result.profile.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error("GET /api/escort/services error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const result = await resolveEscortWithProfile()
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json(
        { error: result?.error || "Unauthorized" },
        { status: result?.error === "Not an escort" ? 403 : 401 }
      )
    }

    const json = await request.json()
    const parsed = createSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const created = await prisma.service.create({
      data: {
        profileId: result.profile.id,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration ?? null,
        locationLat: data.locationLat ?? null,
        locationLng: data.locationLng ?? null,
        locationRadius: data.locationRadius ?? null,
        locationAddress: data.locationAddress ?? null,
        conditions: data.conditions ?? null,
        status: data.status || "ACTIVE",
      },
    })

    return NextResponse.json({ service: created }, { status: 201 })
  } catch (error) {
    console.error("POST /api/escort/services error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


