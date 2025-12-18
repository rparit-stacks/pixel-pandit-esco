import { auth } from "@/lib/auth-server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import * as bcrypt from "bcryptjs"
import { Role, UserStatus } from "@prisma/client"

// Helper to get or create user from session
async function getOrCreateUser(session: any) {
  if (!session?.user?.id || !session?.user?.email) {
    return null
  }

  // Try finding by session ID first
  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, password: true }
  })

  // If not found by ID, try by email
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, password: true }
    })
  }

  // If still not found, create new user
  if (!user) {
    const randomPassword = Math.random().toString(36) + session.user.email
    user = await prisma.user.create({
      data: {
        email: session.user.email,
        password: await bcrypt.hash(randomPassword, 10),
        role: (session.user.role as Role) || Role.CLIENT,
        status: UserStatus.ACTIVE,
      },
      select: { id: true, email: true, password: true }
    })
  }

  return user
}

// GET user settings
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getOrCreateUser(session)
    if (!user) {
      return NextResponse.json({ error: "Could not resolve user" }, { status: 401 })
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            displayName: true,
            bio: true,
            age: true,
            mainPhotoUrl: true,
            isOnline: true,
            callsEnabled: true,
            city: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    })

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: fullUser })
  } catch (error) {
    console.error("GET /api/user/settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update user settings
const updateSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  bio: z.string().max(1000).optional(),
  age: z.number().min(18).max(99).optional(),
  cityId: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
})

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getOrCreateUser(session)
    if (!user) {
      return NextResponse.json({ error: "Could not resolve user" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.errors }, { status: 400 })
    }

    const { displayName, bio, age, cityId, currentPassword, newPassword } = parsed.data

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required" }, { status: 400 })
      }

      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
    }

    // Update profile if any profile fields provided
    if (displayName || bio !== undefined || age || cityId) {
      await prisma.profile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          displayName: displayName || session.user.email || "User",
          bio,
          age,
          cityId
        },
        update: {
          ...(displayName && { displayName }),
          ...(bio !== undefined && { bio }),
          ...(age && { age }),
          ...(cityId && { cityId })
        }
      })
    }

    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error: any) {
    console.error("PATCH /api/user/settings error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

// Delete account
export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getOrCreateUser(session)
    if (!user) {
      return NextResponse.json({ error: "Could not resolve user" }, { status: 401 })
    }

    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id: user.id }
    })

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/user/settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
