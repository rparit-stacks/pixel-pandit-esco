import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resolveEscortWithProfile } from "@/lib/user-resolver"

export async function GET() {
  try {
    const result = await resolveEscortWithProfile()
    
    if (!result || result.error || !result.user || !result.profile) {
      return NextResponse.json({ 
        error: result?.error || "Unauthorized" 
      }, { status: result?.error === "Not an escort" ? 403 : 401 })
    }

    const { user, profile } = result
    const userId = user.id

    // Get counts in parallel
    const [
      favoritedByCount,
      unreadMessagesCount,
      pendingCallsCount,
      totalChatsCount,
      recentChats
    ] = await Promise.all([
      // Favorited by clients count
      prisma.favorite.count({
        where: { profileId: profile.id }
      }),
      // Unread messages (chat messages from clients in last 24h)
      prisma.chatMessage.count({
        where: {
          thread: { escortProfileId: profile.id },
          senderId: { not: userId },
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      // Pending call requests
      prisma.callRequest.count({
        where: {
          escortProfileId: profile.id,
          status: "PENDING"
        }
      }).catch(() => 0),
      // Total chats
      prisma.chatThread.count({
        where: { escortProfileId: profile.id }
      }),
      // Recent chats
      prisma.chatThread.findMany({
        where: { escortProfileId: profile.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          client: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: {
              body: true,
              createdAt: true,
              senderId: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        isOnline: profile.isOnline,
        callsEnabled: profile.callsEnabled,
        isVerified: profile.isVerified,
        isVip: profile.isVip,
        mainPhotoUrl: profile.mainPhotoUrl
      },
      stats: {
        profileViews: 0, // TODO: Implement view tracking
        unreadMessages: unreadMessagesCount,
        pendingCalls: pendingCallsCount,
        favoritedBy: favoritedByCount,
        totalChats: totalChatsCount
      },
      recentChats: recentChats.map(thread => ({
        id: thread.id,
        clientId: thread.client?.id,
        clientEmail: thread.client?.email || "Unknown",
        clientName: thread.client?.name || thread.client?.email?.split("@")[0] || "Unknown",
        lastMessage: thread.messages[0]?.body || "No messages yet",
        isFromClient: thread.messages[0]?.senderId !== userId,
        date: thread.updatedAt
      }))
    })
  } catch (error) {
    console.error("GET /api/dashboard/escort error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
