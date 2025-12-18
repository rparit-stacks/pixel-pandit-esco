import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"

export async function DELETE() {
  try {
    const user = await requireAuth()

    // Cascade deletes handled by DB relations (onDelete: Cascade where set)
    await prisma.user.delete({
      where: { id: user.id },
    })

    return NextResponse.json({ message: "Account deleted" })
  } catch (error) {
    console.error("DELETE /api/account/delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

