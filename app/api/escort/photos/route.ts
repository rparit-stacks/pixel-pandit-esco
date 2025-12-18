import { auth } from "@/lib/auth-server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

// Helper to resolve user ID
async function resolveEscortUser(session: any) {
  let dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true }
  })

  if (!dbUser && session.user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true }
    })
  }

  if (!dbUser || dbUser.role !== Role.ESCORT) {
    return null
  }

  return dbUser
}

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
      select: {
        id: true,
        displayName: true,
        mainPhotoUrl: true
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

  // Load photos separately ordered by createdAt (no custom order field)
  const photosRaw = await prisma.photo.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      url: true,
      createdAt: true,
    },
  })

  const photos = photosRaw.map((photo) => ({
    id: photo.id,
    url: photo.url,
    isMain: photo.url === profile.mainPhotoUrl,
    order: 0,
  }))

    return NextResponse.json({
      id: profile.id,
      displayName: profile.displayName,
      mainPhotoUrl: profile.mainPhotoUrl,
      photos
    })
  } catch (error) {
    console.error("GET /api/escort/photos error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await resolveEscortUser(session)
    if (!dbUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Ensure profile exists
    let profile = await prisma.profile.findUnique({
      where: { userId: dbUser.id },
      select: { id: true, mainPhotoUrl: true },
    })

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: dbUser.id,
          displayName: session.user.name || session.user.email?.split("@")[0] || "New Escort",
        },
        select: { id: true, mainPhotoUrl: true },
      })
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImageToCloudinary(file, "escort-photos")

    // Create photo record
    const photo = await prisma.photo.create({
      data: {
        profileId: profile.id,
        url: uploadResult.url,
        alt: `${session.user.name || "Escort"} photo`,
      },
    })

    // If no main photo set yet, set this as main
    if (!profile.mainPhotoUrl) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { mainPhotoUrl: uploadResult.url },
      })
    }

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error("POST /api/escort/photos error:", error)
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
    const { photoId, setMain } = body

    const profile = await prisma.profile.findUnique({
      where: { userId: dbUser.id },
      include: { photos: true }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (setMain && photoId) {
      const photo = profile.photos.find(p => p.id === photoId)
      if (!photo) {
        return NextResponse.json({ error: "Photo not found" }, { status: 404 })
      }

      await prisma.profile.update({
        where: { id: profile.id },
        data: { mainPhotoUrl: photo.url }
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("PATCH /api/escort/photos error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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
    const { photoId } = body

    if (!photoId) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: dbUser.id },
      include: { photos: true }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const photo = profile.photos.find(p => p.id === photoId)
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    // Delete the photo
    await prisma.photo.delete({
      where: { id: photoId }
    })

    // If this was the main photo, update profile
    if (profile.mainPhotoUrl === photo.url) {
      const remainingPhotos = profile.photos.filter(p => p.id !== photoId)
      await prisma.profile.update({
        where: { id: profile.id },
        data: { 
          mainPhotoUrl: remainingPhotos[0]?.url || null 
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/escort/photos error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

