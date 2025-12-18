import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getBoundingBox, calculateDistance } from "@/lib/location-utils"
import { ServiceStatus } from "@prisma/client"

const querySchema = z.object({
  city: z.string().min(1).optional(),
  verified: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  vip: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  q: z.string().max(100).optional(),
  // Location-based search
  lat: z
    .string()
    .transform((v) => parseFloat(v))
    .refine((v) => !Number.isNaN(v) && v >= -90 && v <= 90, "Invalid latitude")
    .optional(),
  lng: z
    .string()
    .transform((v) => parseFloat(v))
    .refine((v) => !Number.isNaN(v) && v >= -180 && v <= 180, "Invalid longitude")
    .optional(),
  radius: z
    .string()
    .transform((v) => parseFloat(v))
    .refine((v) => !Number.isNaN(v) && v > 0, "Invalid radius")
    .optional(),
  limit: z
    .string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !Number.isNaN(v), "Invalid limit")
    .optional(),
  offset: z
    .string()
    .transform((v) => parseInt(v, 10))
    .refine((v) => !Number.isNaN(v), "Invalid offset")
    .optional(),
})

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 })
    }

    const { city, verified, vip, q, lat, lng, radius } = parsed.data
    const limit = Math.min(Math.max(parsed.data.limit ?? 20, 1), 50)
    const offset = Math.max(parsed.data.offset ?? 0, 0)

    // When location search is active, we'll filter manually after fetching
    // because we need to check both profile location AND service locations
    // So we don't apply location filter in the initial query

    const escorts = await prisma.profile.findMany({
      where: {
        // Only show escort profiles (users with ESCORT role)
        user: {
          role: "ESCORT",
        },
        ...(verified !== undefined ? { isVerified: verified } : {}),
        ...(vip !== undefined ? { isVip: vip } : {}),
        ...(city
          ? {
              city: { slug: city },
            }
          : {}),
        ...(q
          ? {
              OR: [
                { displayName: { contains: q, mode: "insensitive" } },
                { listing: { is: { title: { contains: q, mode: "insensitive" } } } },
                { listing: { is: { about: { contains: q, mode: "insensitive" } } } },
              ],
            }
          : {}),
      },
      take: limit * 3, // Fetch more to account for filtering by service locations
      skip: offset,
      include: {
        city: { select: { id: true, name: true, slug: true } },
        listing: { select: { title: true, about: true } },
        photos: { select: { url: true }, take: 3 },
        customServices: {
          where: { status: ServiceStatus.ACTIVE },
          select: {
            id: true,
            name: true,
            locationLat: true,
            locationLng: true,
            locationRadius: true,
            locationAddress: true,
          },
        },
      },
      orderBy: {
        isVip: "desc",
      },
    })

    // Get total count for pagination
    const total = await prisma.profile.count({
      where: {
        // Only count escort profiles (users with ESCORT role)
        user: {
          role: "ESCORT",
        },
        ...(verified !== undefined ? { isVerified: verified } : {}),
        ...(vip !== undefined ? { isVip: vip } : {}),
        ...(city ? { city: { slug: city } } : {}),
        ...(q ? {
          OR: [
            { displayName: { contains: q, mode: "insensitive" } },
            { listing: { is: { title: { contains: q, mode: "insensitive" } } } },
            { listing: { is: { about: { contains: q, mode: "insensitive" } } } },
          ],
        } : {}),
      },
    })

    // Filter by exact distance if location search is active
    // Check both profile location AND service locations
    let filteredEscorts = escorts
    const escortDistances = new Map<string, number>()
    
    if (lat !== undefined && lng !== undefined && radius !== undefined) {
      filteredEscorts = escorts.filter((escort) => {
        let minDistance = Infinity
        let isWithinRange = false

        // Check profile location first
        if (escort.locationLat && escort.locationLng && escort.locationRadius) {
          const profileDistance = calculateDistance(lat, lng, escort.locationLat, escort.locationLng)
          const effectiveRadius = Math.max(radius, escort.locationRadius)
          if (profileDistance <= effectiveRadius) {
            isWithinRange = true
            minDistance = Math.min(minDistance, profileDistance)
          }
        }

        // Check all active services' locations
        if (escort.customServices && escort.customServices.length > 0) {
          for (const service of escort.customServices) {
            if (service.locationLat && service.locationLng && service.locationRadius) {
              const serviceDistance = calculateDistance(lat, lng, service.locationLat, service.locationLng)
              const effectiveRadius = Math.max(radius, service.locationRadius)
              if (serviceDistance <= effectiveRadius) {
                isWithinRange = true
                minDistance = Math.min(minDistance, serviceDistance)
              }
            }
          }
        }

        // If profile has no location but has services, check services only
        // If service doesn't have location, it falls back to profile location (handled above)
        // If neither has location, exclude this profile
        
        if (isWithinRange && minDistance !== Infinity) {
          escortDistances.set(escort.id, minDistance)
        }
        
        return isWithinRange && minDistance !== Infinity
      })
      
      // Sort by distance (nearest first)
      filteredEscorts.sort((a, b) => {
        const distA = escortDistances.get(a.id) || Infinity
        const distB = escortDistances.get(b.id) || Infinity
        return distA - distB
      })

      // Apply limit after filtering
      filteredEscorts = filteredEscorts.slice(0, limit)
    }

    const data = filteredEscorts.map((escort) => {
      // Calculate the minimum distance (from profile or services)
      let minDistance: number | null = null
      if (lat !== undefined && lng !== undefined) {
        const distances: number[] = []
        
        // Profile location distance
        if (escort.locationLat && escort.locationLng) {
          distances.push(calculateDistance(lat, lng, escort.locationLat, escort.locationLng))
        }
        
        // Service locations distances
        if (escort.customServices) {
          for (const service of escort.customServices) {
            if (service.locationLat && service.locationLng) {
              distances.push(calculateDistance(lat, lng, service.locationLat, service.locationLng))
            }
          }
        }
        
        if (distances.length > 0) {
          minDistance = Math.min(...distances)
        } else {
          // Use stored distance from filter if available
          minDistance = escortDistances.get(escort.id) || null
        }
      }

      return {
        id: escort.id,
        displayName: escort.displayName,
        age: escort.age,
        city: escort.city,
        rateHourly: escort.rateHourly,
        isVerified: escort.isVerified,
        isVip: escort.isVip,
        isOnline: escort.isOnline,
        mainPhotoUrl: escort.mainPhotoUrl ?? escort.photos[0]?.url ?? null,
        services: escort.services,
        listingTitle: escort.listing?.title ?? null,
        about: escort.listing?.about ?? null,
        locationLat: escort.locationLat,
        locationLng: escort.locationLng,
        locationRadius: escort.locationRadius,
        locationAddress: escort.locationAddress,
        distance: minDistance,
      }
    })

    return NextResponse.json({
      count: data.length,
      total,
      limit,
      offset,
      results: data,
    })
  } catch (error) {
    console.error("GET /api/escorts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

