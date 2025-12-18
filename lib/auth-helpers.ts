import { auth } from "./auth-server"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

/**
 * Get current session on server side
 */
export async function getCurrentSession() {
  return await auth()
}

/**
 * Get current user on server side
 */
export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user || null
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

/**
 * Require specific role - redirects to login if role doesn't match
 */
export async function requireRole(role: Role) {
  const user = await requireAuth()
  if (user.role !== role) {
    redirect("/login")
  }
  return user
}

/**
 * Get redirect URL based on user role
 */
export function getDashboardUrl(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return "/admin"
    case Role.ESCORT:
      return "/escort/dashboard"
    case Role.CLIENT:
    default:
      return "/dashboard"
  }
}

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === Role.ADMIN
}

/**
 * Check if current user is escort
 */
export async function isEscort() {
  const user = await getCurrentUser()
  return user?.role === Role.ESCORT
}

/**
 * Check if current user is client
 */
export async function isClient() {
  const user = await getCurrentUser()
  return user?.role === Role.CLIENT
}

/**
 * Require escort role - returns user or throws
 */
export async function requireEscort() {
  const user = await requireAuth()
  if (user.role !== Role.ESCORT) {
    redirect("/login")
  }
  return user
}

/**
 * Require client role - returns user or throws
 */
export async function requireClient() {
  const user = await requireAuth()
  if (user.role !== Role.CLIENT) {
    redirect("/login")
  }
  return user
}