import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveOrCreateUser } from "@/lib/user-resolver"
import { Role } from "@prisma/client"

export async function GET() {
  try {
    const user = await resolveOrCreateUser(Role.CLIENT)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== Role.CLIENT) {
      return NextResponse.json({ error: "Forbidden - Client only" }, { status: 403 })
    }

    const userId = user.id

    // Get counts in parallel
    const [
      favoritesCount,
      activeChatsCount,
      callRequestsCount,
      recentActivity,
      favoriteProfiles
    ] = await Promise.all([
      // Saved profiles count
      prisma.favorite.count({
        where: { userId }
      }),
      // Active chats count
      prisma.chatThread.count({
        where: { clientId: userId }
      }),
      // Call requests count
      prisma.callRequest.count({
        where: { clientId: userId }
      }).catch(() => 0),
      // Recent activity (last 5 chats)
      prisma.chatThread.findMany({
        where: { clientId: userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          escortProfile: {
            select: {
              id: true,
              displayName: true,
              mainPhotoUrl: true
            }
          },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: {
              body: true,
              createdAt: true
            }
          }
        }
      }),
      // Favorite profiles
      prisma.favorite.findMany({
        where: { userId },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          profile: {
            select: {
              id: true,
              displayName: true,
              mainPhotoUrl: true,
              isVerified: true,
              isVip: true,
              isOnline: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      stats: {
        savedProfiles: favoritesCount,
        activeChats: activeChatsCount,
        callRequests: callRequestsCount,
      },
      recentActivity: recentActivity.map(thread => ({
        type: "chat",
        threadId: thread.id,
        escortId: thread.escortProfile?.id,
        escortName: thread.escortProfile?.displayName || "Unknown",
        escortPhoto: thread.escortProfile?.mainPhotoUrl,
        lastMessage: thread.messages[0]?.body || "No messages yet",
        date: thread.updatedAt
      })),
      favorites: favoriteProfiles.map(fav => ({
        id: fav.profile?.id,
        displayName: fav.profile?.displayName || "Unknown",
        mainPhotoUrl: fav.profile?.mainPhotoUrl,
        isVerified: fav.profile?.isVerified || false,
        isVip: fav.profile?.isVip || false,
        isOnline: fav.profile?.isOnline || false
      })).filter(f => f.id)
    })
  } catch (error) {
    console.error("GET /api/dashboard/client error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
