import { NextResponse } from "next/server"
import { resolveUser } from "@/lib/user-resolver"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const user = await resolveUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: {
        planId: true,
        chatBalance: true,
        isUnlimited: true,
        status: true,
        expiresAt: true,
      }
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("GET /api/user/subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
