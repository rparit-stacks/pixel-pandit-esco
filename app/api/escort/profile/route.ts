import { auth } from "@/lib/auth-server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { z } from "zod"

// Helper to resolve user from database
async function resolveEscortUser(session: any) {
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

  if (!dbUser || dbUser.role !== Role.ESCORT) {
    return null
  }

  return dbUser
}

const updateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(1000).optional().nullable(),
  age: z.number().min(18).max(99).optional().nullable(),
  cityId: z.string().optional().nullable(),
  whatsappNumber: z.string().max(30).optional().nullable(),
  phoneNumber: z.string().max(30).optional().nullable(),
  rateHourly: z.number().min(0).optional().nullable(),
  rateTwoHours: z.number().min(0).optional().nullable(),
  rateOvernight: z.number().min(0).optional().nullable(),
  services: z.array(z.string()).optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await resolveEscortUser(session)
    if (!dbUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: dbUser.id },
      include: {
        city: {
          select: { id: true, name: true }
        }
      }
    })

    if (!profile) {
      // Return empty profile data for new escorts
      return NextResponse.json({
        id: null,
        displayName: session.user.name || session.user.email?.split("@")[0] || "",
        bio: null,
        age: null,
        cityId: null,
        cityName: null,
        whatsappNumber: null,
        phoneNumber: null,
        rateHourly: null,
        rateTwoHours: null,
        rateOvernight: null,
        mainPhotoUrl: null,
        isVerified: false,
        isVip: false,
        services: []
      })
    }

    return NextResponse.json({
      id: profile.id,
      displayName: profile.displayName,
      bio: profile.bio,
      age: profile.age,
      cityId: profile.cityId,
      cityName: profile.city?.name || null,
      whatsappNumber: profile.whatsappNumber,
      phoneNumber: profile.phoneNumber,
      rateHourly: profile.rateHourly,
      rateTwoHours: profile.rateTwoHours,
      rateOvernight: profile.rateOvernight,
      mainPhotoUrl: profile.mainPhotoUrl,
      isVerified: profile.isVerified,
      isVip: profile.isVip,
      services: profile.services
    })
  } catch (error) {
    console.error("GET /api/escort/profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await resolveEscortUser(session)
    if (!dbUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error }, { status: 400 })
    }

    const data = parsed.data

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: dbUser.id }
    })

    if (existingProfile) {
      // Update existing profile
      const updated = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          ...(data.displayName !== undefined && { displayName: data.displayName }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.age !== undefined && { age: data.age }),
          ...(data.cityId !== undefined && { cityId: data.cityId }),
          ...(data.whatsappNumber !== undefined && { whatsappNumber: data.whatsappNumber }),
          ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
          ...(data.rateHourly !== undefined && { rateHourly: data.rateHourly }),
          ...(data.rateTwoHours !== undefined && { rateTwoHours: data.rateTwoHours }),
          ...(data.rateOvernight !== undefined && { rateOvernight: data.rateOvernight }),
          ...(data.services !== undefined && { services: data.services }),
        }
      })

      return NextResponse.json({ success: true, profile: updated })
    } else {
      // Create new profile
      const created = await prisma.profile.create({
        data: {
          userId: dbUser.id,
          displayName: data.displayName || session.user.name || "New Escort",
          bio: data.bio || null,
          age: data.age || null,
          cityId: data.cityId || null,
          whatsappNumber: data.whatsappNumber || null,
          phoneNumber: data.phoneNumber || null,
          rateHourly: data.rateHourly || null,
          rateTwoHours: data.rateTwoHours || null,
          rateOvernight: data.rateOvernight || null,
          services: data.services || [],
        }
      })

      return NextResponse.json({ success: true, profile: created })
    }
  } catch (error) {
    console.error("PATCH /api/escort/profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

