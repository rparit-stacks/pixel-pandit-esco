import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { ServiceStatus } from "@prisma/client"

export async function GET(req: Request, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { id } = await params

    const urlId = (() => {
      if (id) return id
      try {
        const parts = new URL(req.url).pathname.split("/")
        return parts[parts.length - 1] || undefined
      } catch {
        return undefined
      }
    })()

    if (!urlId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const escort = await prisma.profile.findUnique({
      where: { id: urlId },
      include: {
        city: { select: { id: true, name: true, slug: true } },
        listing: { select: { title: true, about: true, isVisible: true } },
        photos: { select: { url: true, alt: true }, orderBy: { createdAt: "asc" } },
        user: { select: { id: true, role: true, status: true } },
        customServices: {
          where: { status: ServiceStatus.ACTIVE },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            locationLat: true,
            locationLng: true,
            locationRadius: true,
            locationAddress: true,
            conditions: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!escort || escort.listing?.isVisible === false) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: escort.id,
      displayName: escort.displayName,
      bio: escort.bio,
      age: escort.age,
      city: escort.city,
      rateHourly: escort.rateHourly,
      isVerified: escort.isVerified,
      isVip: escort.isVip,
      isOnline: escort.isOnline,
      callsEnabled: escort.callsEnabled,
      whatsappNumber: escort.whatsappNumber,
      phoneNumber: escort.phoneNumber,
      mainPhotoUrl: escort.mainPhotoUrl ?? escort.photos[0]?.url ?? null,
      services: escort.services, // Legacy tags (keep for backward compatibility)
      customServices: escort.customServices, // New service model
      photos: escort.photos,
      listing: escort.listing,
      locationLat: escort.locationLat,
      locationLng: escort.locationLng,
      locationRadius: escort.locationRadius,
      locationAddress: escort.locationAddress,
      createdAt: escort.createdAt,
    })
  } catch (error) {
    console.error("GET /api/escorts/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

