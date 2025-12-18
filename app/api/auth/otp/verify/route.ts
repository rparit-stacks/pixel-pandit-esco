import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"
import { Role, UserStatus } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const schema = z.object({
  email: z.string().email("Invalid email"),
  code: z.string().length(6, "Invalid code"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const token = await prisma.otpToken.findUnique({ where: { email: parsed.data.email } })
    if (!token || token.consumed) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    if (token.code !== parsed.data.code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    if (token.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 })
    }

    // Upsert user as CLIENT with random password (OTP login)
    const randomPassword = await bcrypt.hash(token.code + token.email, 10)
    const user = await prisma.user.upsert({
      where: { email: token.email },
      create: {
        email: token.email,
        password: randomPassword,
        role: Role.CLIENT,
        status: UserStatus.ACTIVE,
      },
      update: {},
      select: { id: true, email: true, role: true },
    })

    await prisma.otpToken.update({
      where: { email: token.email },
      data: { consumed: true },
    })

    // For simplicity, return user info; frontend can call NextAuth credentials login after setting a password-less flow.
    return NextResponse.json({ message: "OTP verified", user })
  } catch (error) {
    console.error("POST /api/auth/otp/verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

