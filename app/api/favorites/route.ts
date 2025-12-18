import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveOrCreateUser } from "@/lib/user-resolver"
import { z } from "zod"
import { Role } from "@prisma/client"

const bodySchema = z.object({
  profileId: z.string().min(1, "profileId is required"),
})

export async function GET() {
  try {
    const user = await resolveOrCreateUser(Role.CLIENT)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (user.role !== Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        profile: {
          select: {
            id: true,
            displayName: true,
            city: { select: { name: true, slug: true } },
            rateHourly: true,
            isVerified: true,
            isVip: true,
            isOnline: true,
            mainPhotoUrl: true,
            services: true,
            listing: { select: { title: true, about: true } },
            photos: { select: { url: true }, take: 1 },
          },
        },
      },
    })

    const results = favorites.map((fav) => ({
      id: fav.profile.id,
      displayName: fav.profile.displayName,
      city: fav.profile.city,
      rateHourly: fav.profile.rateHourly,
      isVerified: fav.profile.isVerified,
      isVip: fav.profile.isVip,
      isOnline: fav.profile.isOnline,
      mainPhotoUrl: fav.profile.mainPhotoUrl ?? fav.profile.photos[0]?.url ?? null,
      services: fav.profile.services,
      listingTitle: fav.profile.listing?.title ?? null,
      about: fav.profile.listing?.about ?? null,
    }))

    return NextResponse.json({ count: results.length, results })
  } catch (error) {
    console.error("GET /api/favorites error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await resolveOrCreateUser(Role.CLIENT)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (user.role !== Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const json = await request.json()
    const parsed = bodySchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 })
    }

    const { profileId } = parsed.data

    await prisma.favorite.upsert({
      where: {
        userId_profileId: {
          userId: user.id,
          profileId,
        },
      },
      create: {
        userId: user.id,
        profileId,
      },
      update: {},
    })

    return NextResponse.json({ message: "Added to favorites" }, { status: 201 })
  } catch (error) {
    console.error("POST /api/favorites error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await resolveOrCreateUser(Role.CLIENT)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (user.role !== Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const json = await request.json()
    const parsed = bodySchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 })
    }

    const { profileId } = parsed.data

    await prisma.favorite.deleteMany({
      where: { userId: user.id, profileId },
    })

    return NextResponse.json({ message: "Removed from favorites" })
  } catch (error) {
    console.error("DELETE /api/favorites error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
