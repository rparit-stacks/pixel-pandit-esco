import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import * as bcrypt from "bcryptjs"
import { Role, UserStatus } from "@prisma/client"
import { z } from "zod"
import { rateLimit, getClientIP } from "@/lib/rate-limit"

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CLIENT", "ESCORT"]).default("CLIENT"),
  displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req)
    const limit = rateLimit(`signup:${clientIP}`, {
      interval: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 signups per 15 minutes
    })

    if (!limit.success) {
      return NextResponse.json(
        {
          error: "Too many signup attempts. Please try again later.",
          resetTime: limit.resetTime,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": limit.resetTime.toString(),
          },
        }
      )
    }

    const body = await req.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        status: validatedData.role === Role.ESCORT ? UserStatus.PENDING : UserStatus.ACTIVE,
        ...(validatedData.role === Role.ESCORT && validatedData.displayName
          ? {
              profile: {
                create: {
                  displayName: validatedData.displayName,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

