import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth-server"
import { Role, UserStatus } from "@prisma/client"

export type ResolvedUser = {
  id: string
  email: string
  role: Role
  name: string | null
}

/**
 * Resolves the actual database user from session
 * Handles case where session ID doesn't match DB (e.g., after DB reset)
 * Creates user if not found (for logged in users via OAuth)
 */
export async function resolveUser(): Promise<ResolvedUser | null> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return null
  }

  // Try to find by session ID first
  let dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true, name: true }
  })

  if (dbUser) {
    return dbUser
  }

  // Try to find by email
  dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, role: true, name: true }
  })

  if (dbUser) {
    return dbUser
  }

  // User doesn't exist - this shouldn't happen normally
  // but can happen if DB was reset while session is still valid
  console.warn(`User not found in DB: session.id=${session.user.id}, email=${session.user.email}`)
  return null
}

/**
 * Resolves user and creates if not found
 * Use this for endpoints where user must exist (e.g., creating threads)
 */
export async function resolveOrCreateUser(defaultRole: Role = Role.CLIENT): Promise<ResolvedUser | null> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return null
  }

  // Try to find by session ID first
  let dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true, name: true }
  })

  if (dbUser) {
    return dbUser
  }

  // Try to find by email
  dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, role: true, name: true }
  })

  if (dbUser) {
    return dbUser
  }

  // Create new user
  console.log(`Creating new user for: ${session.user.email} with role ${defaultRole}`)
  const newUser = await prisma.user.create({
    data: {
      email: session.user.email,
      password: "OAUTH_" + Math.random().toString(36).slice(2),
      role: defaultRole,
      status: UserStatus.ACTIVE,
      name: session.user.name || session.user.email.split("@")[0],
    },
    select: { id: true, email: true, role: true, name: true }
  })

  return newUser
}

/**
 * Resolves escort user and their profile
 * Creates profile if not found
 */
export async function resolveEscortWithProfile() {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return null
  }

  // Find or create user
  let dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true, name: true }
  })

  if (!dbUser) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true, name: true }
    })
  }

  if (!dbUser) {
    // Create as ESCORT
    dbUser = await prisma.user.create({
      data: {
        email: session.user.email,
        password: "ESCORT_" + Math.random().toString(36).slice(2),
        role: Role.ESCORT,
        status: UserStatus.ACTIVE,
        name: session.user.name || session.user.email.split("@")[0],
      },
      select: { id: true, email: true, role: true, name: true }
    })
  }

  if (dbUser.role !== Role.ESCORT) {
    return { user: null, profile: null, error: "Not an escort" }
  }

  // Find or create profile
  let profile = await prisma.profile.findUnique({
    where: { userId: dbUser.id },
    select: {
      id: true,
      displayName: true,
      isOnline: true,
      callsEnabled: true,
      isVerified: true,
      isVip: true,
      mainPhotoUrl: true
    }
  })

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId: dbUser.id,
        displayName: dbUser.name || session.user.email?.split("@")[0] || "New Escort",
        isOnline: false,
        callsEnabled: true,
        isVerified: false,
        isVip: false
      },
      select: {
        id: true,
        displayName: true,
        isOnline: true,
        callsEnabled: true,
        isVerified: true,
        isVip: true,
        mainPhotoUrl: true
      }
    })
  }

  return { user: dbUser, profile, error: null }
}

