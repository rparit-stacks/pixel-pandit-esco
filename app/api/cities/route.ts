import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        heroImg: true,
      },
    })

    return NextResponse.json({ cities })
  } catch (error) {
    console.error("GET /api/cities error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

