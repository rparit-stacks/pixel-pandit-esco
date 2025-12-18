import { auth } from "@/lib/auth-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    return NextResponse.json(session || { user: null })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null })
  }
}
