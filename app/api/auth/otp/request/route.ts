import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Invalid email"),
})

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otpToken.upsert({
      where: { email: parsed.data.email },
      create: { email: parsed.data.email, code, expiresAt },
      update: { code, expiresAt, consumed: false },
    })

    // In production, send code via email. For now, return masked response and log.
    console.log(`OTP for ${parsed.data.email}: ${code}`)

    return NextResponse.json({ message: "OTP sent to email" })
  } catch (error) {
    console.error("POST /api/auth/otp/request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

